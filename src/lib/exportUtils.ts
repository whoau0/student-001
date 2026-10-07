import pptxgen from "pptxgenjs";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import saveAs from "file-saver";
import JSZip from "jszip";
import { StudyMaterialResult, PresentationData, SummaryData, ExamData, MindmapData } from "@/types";

// 1. PPTX 다운로드
export async function downloadPptx(presentation: PresentationData, filenamePrefix = "공부방_발표자료") {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "내 공부방 AI";
  pptx.company = "My Study Room";
  pptx.title = presentation.title;

  // 표지 슬라이드
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: "FDFBF7" }; // 웜 화이트
  
  // 장식용 상단 우드 바
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.25,
    fill: { color: "D7C4B7" },
    line: { color: "D7C4B7" }
  });

  titleSlide.addText(presentation.title, {
    x: 1.0,
    y: 2.2,
    w: 11.3,
    h: 1.5,
    fontSize: 34,
    bold: true,
    color: "3D3A37",
    fontFace: "Malgun Gothic",
    align: "left"
  });

  if (presentation.subtitle) {
    titleSlide.addText(presentation.subtitle, {
      x: 1.0,
      y: 3.8,
      w: 11.3,
      h: 0.8,
      fontSize: 18,
      color: "7D756D",
      fontFace: "Malgun Gothic",
      align: "left"
    });
  }

  titleSlide.addText("생성: <내 공부방> AI 학습 튜터", {
    x: 1.0,
    y: 6.2,
    w: 5.0,
    h: 0.5,
    fontSize: 12,
    color: "8C6D58",
    fontFace: "Malgun Gothic"
  });

  // 본문 슬라이드들
  presentation.slides.forEach((slide) => {
    const s = pptx.addSlide();
    s.background = { color: "FFFFFF" };

    // 상단 헤더
    s.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: 1.0,
      fill: { color: "F3EFEA" },
      line: { color: "EADBCE" }
    });

    // 슬라이드 번호 뱃지
    s.addText(`Slide ${slide.slideNumber}`, {
      x: 0.8,
      y: 0.25,
      w: 1.5,
      h: 0.5,
      fontSize: 11,
      bold: true,
      color: "E07A5F",
      fontFace: "Malgun Gothic"
    });

    // 슬라이드 제목
    s.addText(slide.title, {
      x: 2.2,
      y: 0.2,
      w: 10.0,
      h: 0.6,
      fontSize: 20,
      bold: true,
      color: "3D3A37",
      fontFace: "Malgun Gothic"
    });

    // 본문 불릿 포인트
    const bullets = slide.bulletPoints.map((bp) => ({
      text: bp,
      options: {
        fontSize: 15,
        color: "4A4643",
        bullet: true,
        spaceAfter: 12,
        fontFace: "Malgun Gothic"
      }
    }));

    s.addText(bullets, {
      x: 0.9,
      y: 1.5,
      w: 11.5,
      h: 4.5,
      align: "left",
      valign: "top"
    });

    // 발표자 노트 (스크립트)
    if (slide.script) {
      s.addNotes(`[발표 스크립트]\n${slide.script}`);
    }
  });

  const blob = await pptx.write({ outputType: "blob" }) as Blob;
  saveAs(blob, `${filenamePrefix}_${presentation.title.slice(0, 15).replace(/[^\w가-힣]/g, "_")}.pptx`);
}

// 2. 요약본 Word (.docx) 다운로드
export async function downloadSummaryDocx(summary: SummaryData, filenamePrefix = "공부방_요약정리") {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: summary.title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),
          new Paragraph({
            text: "■ 핵심 개요 (Overview)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: summary.overview,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "■ 핵심 요약 포인트 (Key Points)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          ...summary.keyPoints.map(
            (kp) =>
              new Paragraph({
                text: `• ${kp}`,
                spacing: { after: 60 }
              })
          ),
          new Paragraph({
            text: "■ 단원별 세부 내용 (Detailed Sections)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 }
          }),
          ...summary.sections.flatMap((sec) => [
            new Paragraph({
              text: `▶ ${sec.title}`,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 150, after: 80 }
            }),
            new Paragraph({
              text: sec.content,
              spacing: { after: 120 }
            }),
            ...(sec.keyPoints
              ? sec.keyPoints.map(
                  (skp) =>
                    new Paragraph({
                      text: `   - ${skp}`,
                      spacing: { after: 40 }
                    })
                )
              : [])
          ]),
          new Paragraph({
            text: "■ 핵심 전문 용어 사전 (Key Terms)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 }
          }),
          ...summary.keywords.map(
            (kw) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `• ${kw.word}: `, bold: true }),
                  new TextRun({ text: kw.definition })
                ],
                spacing: { after: 80 }
              })
          )
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filenamePrefix}_${summary.title.slice(0, 15).replace(/[^\w가-힣]/g, "_")}.docx`);
}

// 3. 기출문제집 Word (.docx) 다운로드
export async function downloadExamDocx(exam: ExamData, filenamePrefix = "공부방_예상시험지") {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: exam.title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: exam.description || "본 시험지는 <내 공부방> AI가 출제한 실전 대비 예상 기출문제입니다.",
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // 문제 영역
          new Paragraph({
            text: "【 1부 : 객관식 문제 】",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 }
          }),
          ...exam.multipleChoice.flatMap((mc) => [
            new Paragraph({
              children: [
                new TextRun({ text: `[Q${mc.id}] `, bold: true, color: "E07A5F" }),
                new TextRun({ text: mc.question, bold: true })
              ],
              spacing: { before: 100, after: 80 }
            }),
            ...mc.options.map(
              (opt, optIdx) =>
                new Paragraph({
                  text: `   (${optIdx + 1}) ${opt}`,
                  spacing: { after: 40 }
                })
            )
          ]),

          new Paragraph({
            text: "【 2부 : 단답형 / 서술형 주관식 】",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          }),
          ...exam.shortAnswer.flatMap((sa) => [
            new Paragraph({
              children: [
                new TextRun({ text: `[서술형 ${sa.id}] `, bold: true, color: "3D5A80" }),
                new TextRun({ text: sa.question, bold: true })
              ],
              spacing: { before: 100, after: 60 }
            }),
            new Paragraph({
              text: "   [답안 작성란] __________________________________________________________________",
              spacing: { after: 120 }
            })
          ]),

          // 정답 및 해설 영역 (페이지 구분 느낌)
          new Paragraph({
            text: "=========================================",
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: "【 정답 및 상세 해설지 】",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 }
          }),
          ...exam.multipleChoice.flatMap((mc) => [
            new Paragraph({
              children: [
                new TextRun({ text: `[Q${mc.id} 정답] `, bold: true, color: "E07A5F" }),
                new TextRun({ text: `(${mc.answerIndex + 1}) ${mc.options[mc.answerIndex]}`, bold: true })
              ],
              spacing: { before: 80, after: 40 }
            }),
            new Paragraph({
              text: `   해설: ${mc.explanation}`,
              spacing: { after: 100 }
            })
          ]),
          ...exam.shortAnswer.flatMap((sa) => [
            new Paragraph({
              children: [
                new TextRun({ text: `[서술형 ${sa.id} 모범답안] `, bold: true, color: "3D5A80" }),
                new TextRun({ text: sa.answer, bold: true })
              ],
              spacing: { before: 80, after: 40 }
            }),
            new Paragraph({
              text: `   해설/채점기준: ${sa.explanation}`,
              spacing: { after: 100 }
            })
          ])
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filenamePrefix}_${exam.title.slice(0, 15).replace(/[^\w가-힣]/g, "_")}.docx`);
}

// 4. 일반 텍스트/마크다운 파일 다운로드
export function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
}

// 5. 4종 패키지 일괄 ZIP 다운로드
export async function downloadAllZip(material: StudyMaterialResult) {
  const zip = new JSZip();
  const baseName = material.title.slice(0, 20).replace(/[^\w가-힣]/g, "_");

  // 1) 요약본 (Markdown & Text)
  let summaryMd = `# ${material.summary.title}\n\n`;
  summaryMd += `## 1. 핵심 개요\n${material.summary.overview}\n\n`;
  summaryMd += `## 2. 핵심 요약 포인트\n`;
  material.summary.keyPoints.forEach(kp => summaryMd += `- ${kp}\n`);
  summaryMd += `\n## 3. 단원별 세부 내용\n`;
  material.summary.sections.forEach(sec => {
    summaryMd += `### ${sec.title}\n${sec.content}\n\n`;
    if (sec.keyPoints) {
      sec.keyPoints.forEach(p => summaryMd += `  - ${p}\n`);
    }
  });
  summaryMd += `\n## 4. 핵심 용어 사전\n`;
  material.summary.keywords.forEach(kw => summaryMd += `- **${kw.word}**: ${kw.definition}\n`);
  zip.file(`1_요약정리_${baseName}.md`, summaryMd);

  // 2) PPTX 파일 생성 및 압축
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.title = material.presentation.title;
  const tSlide = pptx.addSlide();
  tSlide.addText(material.presentation.title, { x: 1, y: 2, w: 11, fontSize: 32, bold: true });
  if (material.presentation.subtitle) {
    tSlide.addText(material.presentation.subtitle, { x: 1, y: 3.5, w: 11, fontSize: 18, color: "666666" });
  }
  material.presentation.slides.forEach(slide => {
    const s = pptx.addSlide();
    s.addText(`Slide ${slide.slideNumber}: ${slide.title}`, { x: 0.8, y: 0.5, w: 11, fontSize: 20, bold: true });
    s.addText(slide.bulletPoints.map(bp => ({ text: bp, options: { bullet: true, spaceAfter: 10 } })), { x: 0.8, y: 1.5, w: 11, h: 4 });
    if (slide.script) s.addNotes(slide.script);
  });
  const pptxBlob = await pptx.write({ outputType: "blob" }) as Blob;
  zip.file(`2_발표슬라이드_${baseName}.pptx`, pptxBlob);

  // 3) 시험지 텍스트
  let examTxt = `[ ${material.exam.title} ]\n\n`;
  examTxt += `【 1부 : 객관식 문제 】\n`;
  material.exam.multipleChoice.forEach(mc => {
    examTxt += `\n[Q${mc.id}] ${mc.question}\n`;
    mc.options.forEach((opt, idx) => examTxt += `  (${idx+1}) ${opt}\n`);
  });
  examTxt += `\n\n【 2부 : 주관식 문제 】\n`;
  material.exam.shortAnswer.forEach(sa => {
    examTxt += `\n[서술형 ${sa.id}] ${sa.question}\n`;
  });
  examTxt += `\n\n=========================================\n【 정답 및 해설 】\n`;
  material.exam.multipleChoice.forEach(mc => {
    examTxt += `\n[Q${mc.id}] 정답: (${mc.answerIndex+1}) ${mc.options[mc.answerIndex]}\n해설: ${mc.explanation}\n`;
  });
  material.exam.shortAnswer.forEach(sa => {
    examTxt += `\n[서술형 ${sa.id}] 모범답안: ${sa.answer}\n해설: ${sa.explanation}\n`;
  });
  zip.file(`3_예상기출문제_${baseName}.txt`, examTxt);

  // 4) 마인드맵 JSON
  zip.file(`4_마인드맵구조_${baseName}.json`, JSON.stringify(material.mindmap, null, 2));

  // ZIP 압축 다운로드
  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, `공부방_학습자료4종세트_${baseName}.zip`);
}
