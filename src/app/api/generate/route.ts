import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, getSlideImageUrl } from "@/lib/gemini";
import { StudyMaterialResult } from "@/types";

export const maxDuration = 60; // 60 seconds timeout on Vercel
export const dynamic = "force-dynamic";

// YouTube Video ID Extractor
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Extract Video metadata via YouTube oEmbed
async function fetchYouTubeInfo(url: string) {
  try {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    let title = "유튜브 학습 영상";
    let authorName = "";
    if (oembedRes.ok) {
      const data = await oembedRes.json();
      title = data.title || title;
      authorName = data.author_name || "";
    }
    return { videoId, title, authorName };
  } catch (err) {
    console.warn("Failed to fetch youtube oembed or timed out:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceType, youtubeUrl, text, fileName } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다. .env.local에 유효한 Gemini API 키를 입력해 주세요." },
        { status: 500 }
      );
    }

    let studyContent = "";
    let subjectTitle = fileName || "학습 자료";

    if (sourceType === "youtube" && youtubeUrl) {
      const ytInfo = await fetchYouTubeInfo(youtubeUrl);
      if (ytInfo) {
        subjectTitle = ytInfo.title;
        studyContent = `[유튜브 학습 강의 소스]
영상 제목: ${ytInfo.title}
채널명/강사: ${ytInfo.authorName || "온라인 강의"}
영상 링크: ${youtubeUrl}
${text ? `상세 메모/자막: ${text}` : `강의 주제 [${ytInfo.title}]의 핵심 교육 과정, 핵심 개념, 시험 예상 문제, 요약 정리본, 슬라이드 구성안을 작성해 주세요.`}`;
      } else {
        subjectTitle = "유튜브 강의 요약";
        studyContent = `[유튜브 학습 영상]: ${youtubeUrl}\n${text || "이 영상의 주제에 관한 핵심 정리와 시험 예상 문제를 작성해 주세요."}`;
      }
    } else {
      if (!text || text.trim().length === 0) {
        return NextResponse.json(
          { error: "학습할 내용(텍스트 또는 문서 파일)이 비어 있습니다." },
          { status: 400 }
        );
      }
      studyContent = `[문서/교재 학습 소스]\n제목/파일명: ${subjectTitle}\n\n[본문 내용]:\n${text}`;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // AI Model Candidates:
    // Try fastest, officially available Gemini models first to prevent 504 Gateway Timeout,
    // with fallback support.
    const modelSequence = [
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-2.5-flash",
      "gemini-1.5-pro",
      "gemini-3.8-flash",
      "gemini-3.5-flash-lite"
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

        // Add 25 second timeout per model call to prevent server 504
        const generatePromise = model.generateContent(promptText);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on model ${modelName}`)), 25000)
        );

        const result: any = await Promise.race([generatePromise, timeoutPromise]);
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
        console.log(`[Gemini Route] Successfully generated with model: ${modelName}`);
        break; // Success! Exit fallback loop
      } catch (err: any) {
        console.warn(`[Gemini Route] Model ${modelName} failed:`, err?.message || err);
        lastError = err;
        // Continue to fallback model immediately
      }
    }

    if (!successfulResult) {
      console.error("[Gemini Route] All fallback models failed:", lastError);
      return NextResponse.json(
        {
          error: "학습 자료를 불러오지 못했습니다.",
          details: lastError?.message || "AI 모델 호출 실패. API 키나 네트워크 상태를 확인해 주세요."
        },
        { status: 500 }
      );
    }

    // Ensure presentation slides have valid image URLs and visual properties (type-safe)
    const enrichedSlides = (successfulResult.presentation?.slides || []).map((slide: any, idx: number) => {
      const titleStr = typeof slide.title === "string" ? slide.title : String(slide.title || `슬라이드 ${idx + 1}`);
      const keywordStr = typeof slide.imageKeyword === "string" ? slide.imageKeyword : Array.isArray(slide.imageKeyword) ? slide.imageKeyword.join(" ") : titleStr;
      const imgUrl = typeof slide.imageUrl === "string" && slide.imageUrl.length > 0 
        ? slide.imageUrl 
        : getSlideImageUrl(keywordStr, idx);

      let cleanBullets: string[] = [];
      if (Array.isArray(slide.bulletPoints)) {
        cleanBullets = slide.bulletPoints.map((bp: any) =>
          typeof bp === "string" ? bp : typeof bp === "object" ? Object.values(bp).join(" ") : String(bp)
        );
      } else if (typeof slide.bulletPoints === "string") {
        cleanBullets = [slide.bulletPoints];
      }

      const takeawayStr = typeof slide.keyTakeaway === "string" 
        ? slide.keyTakeaway 
        : (cleanBullets[0] || "");

      const badgeStr = typeof slide.badge === "string" ? slide.badge : `Part ${idx + 1}`;
      const scriptStr = typeof slide.script === "string" ? slide.script : "";

      return {
        slideNumber: typeof slide.slideNumber === "number" ? slide.slideNumber : idx + 1,
        title: titleStr,
        bulletPoints: cleanBullets.length > 0 ? cleanBullets : ["핵심 요점 설명"],
        keyTakeaway: takeawayStr,
        badge: badgeStr,
        imageKeyword: keywordStr,
        imageUrl: imgUrl,
        layout: slide.layout || (idx % 2 === 0 ? "split-image" : "card-grid"),
        script: scriptStr,
      };
    });

    const enrichedPresentation = {
      ...successfulResult.presentation,
      title: typeof successfulResult.presentation?.title === "string" ? successfulResult.presentation.title : subjectTitle,
      subtitle: typeof successfulResult.presentation?.subtitle === "string" ? successfulResult.presentation.subtitle : "",
      slides: enrichedSlides,
    };

    const finalResponse: StudyMaterialResult = {
      title: successfulResult.summary?.title || subjectTitle,
      sourceType: sourceType || "text",
      sourceInfo: sourceType === "youtube" ? youtubeUrl : fileName,
      modelUsed: usedModelName,
      generatedAt: new Date().toISOString(),
      summary: successfulResult.summary,
      presentation: enrichedPresentation,
      exam: successfulResult.exam,
      mindmap: successfulResult.mindmap,
    };

    return NextResponse.json(finalResponse);
  } catch (error: any) {
    console.error("[Gemini Route Fatal Error]", error);
    return NextResponse.json(
      {
        error: "학습 자료를 불러오지 못했습니다.",
        details: error?.message || "서버 내부 처리 오류"
      },
      { status: 500 }
    );
  }
}
