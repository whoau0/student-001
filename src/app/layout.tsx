import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 공부방 | 원클릭 AI 맞춤 학습 자료 생성기",
  description: "유튜브 링크나 문서만 넣으면 요약정리, PPT, 시험문제, 마인드맵을 원클릭으로 자동 생성하고 즉시 다운로드하는 AI 스마트 공부방",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="min-h-screen bg-room-bg text-room-text-main antialiased selection:bg-room-wood-light selection:text-room-wood-deep">
        {children}
      </body>
    </html>
  );
}
