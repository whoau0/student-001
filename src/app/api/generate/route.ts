import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/gemini";
import { StudyMaterialResult } from "@/types";

// YouTube Video ID Extractor
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Extract Video metadata or transcripts
async function fetchYouTubeInfo(url: string) {
  try {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;

    // Fetch video title via oembed
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    let title = "유튜브 학습 영상";
    if (oembedRes.ok) {
      const data = await oembedRes.json();
      title = data.title || title;
    }
    return { videoId, title };
  } catch (err) {
    console.error("Failed to fetch youtube oembed", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceType, youtubeUrl, text, fileName } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다. .env.local에 API 키를 입력해 주세요." },
        { status: 500 }
      );
    }

    let studyContent = "";
    let subjectTitle = fileName || "학습 자료";

    if (sourceType === "youtube" && youtubeUrl) {
      const ytInfo = await fetchYouTubeInfo(youtubeUrl);
      if (ytInfo) {
        subjectTitle = ytInfo.title;
      }
      studyContent = `[유튜브 학습 소스]\n영상 링크: ${youtubeUrl}\n영상 제목: ${subjectTitle}\n제공된 상세 내용/자막/요약 텍스트:\n${text || "유튜브 영상의 핵심 개념과 주요 내용을 바탕으로 강의 요약 및 시험문제를 작성해 주세요."}`;
    } else {
      if (!text || text.trim().length === 0) {
        return NextResponse.json(
          { error: "학습할 내용(텍스트 또는 문서 파일)이 비어 있습니다." },
          { status: 400 }
        );
      }
      studyContent = `[문서/텍스트 학습 소스]\n제목/파일명: ${subjectTitle}\n\n[본문 내용]:\n${text}`;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Fallback model list as specified in PRD
    // 1st: gemini-3.8-flash (or available standard flash model)
    // 2nd: gemini-3.5-flash-lite (or gemini-1.5-flash fallback)
    // 3rd: gemini-1.5-flash / gemini-2.5-flash
    const modelSequence = [
      "gemini-3.8-flash",
      "gemini-3.5-flash-lite",
      "gemini-2.5-flash",
      "gemini-1.5-flash"
    ];

    let lastError: any = null;
    let successfulResult: any = null;
    let usedModelName = "";

    const promptText = `${SYSTEM_PROMPT}\n\n[학습 대상 텍스트 전문]:\n${studyContent}\n\n반드시 지정된 JSON 스키마 규격으로만 응답해 주십시오.`;

    for (const modelName of modelSequence) {
      try {
        console.log(`[Gemini Route] Attempting model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const result = await model.generateContent(promptText);
        const responseText = result.response.text();

        if (!responseText || responseText.trim().length === 0) {
          throw new Error("Empty response from AI model");
        }

        // Clean possible markdown code fences if present
        const cleanedJson = responseText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const parsedData = JSON.parse(cleanedJson);

        // Validate basic keys
        if (!parsedData.summary || !parsedData.presentation || !parsedData.exam || !parsedData.mindmap) {
          throw new Error("Missing required JSON structure keys");
        }

        successfulResult = parsedData;
        usedModelName = modelName;
        break; // Success! Exit fallback loop
      } catch (err: any) {
        console.warn(`[Gemini Route] Model ${modelName} failed:`, err?.message || err);
        lastError = err;
        // Continue to fallback model
      }
    }

    if (!successfulResult) {
      console.error("[Gemini Route] All fallback models failed:", lastError);
      return NextResponse.json(
        {
          error: "학습 자료를 불러오지 못했습니다.",
          details: lastError?.message || "AI 모델 호출 실패"
        },
        { status: 500 }
      );
    }

    const finalResponse: StudyMaterialResult = {
      title: successfulResult.summary?.title || subjectTitle,
      sourceType: sourceType || "text",
      sourceInfo: sourceType === "youtube" ? youtubeUrl : fileName,
      modelUsed: usedModelName,
      generatedAt: new Date().toISOString(),
      summary: successfulResult.summary,
      presentation: successfulResult.presentation,
      exam: successfulResult.exam,
      mindmap: successfulResult.mindmap,
    };

    return NextResponse.json(finalResponse);
  } catch (error: any) {
    console.error("[Gemini Route Error]", error);
    return NextResponse.json(
      {
        error: "학습 자료를 불러오지 못했습니다.",
        details: error?.message || "서버 내부 오류"
      },
      { status: 500 }
    );
  }
}
