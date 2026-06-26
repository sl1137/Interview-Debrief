import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "面试复盘教练",
  description: "上传面试转录、连接项目经历,获得温和而具体的面试复盘报告。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="sm:h-screen sm:p-4">
          <div className="mx-auto flex h-full max-w-[1180px] flex-col overflow-hidden bg-[var(--surface)] sm:flex-row sm:rounded-[26px] sm:border sm:border-[var(--border)] sm:shadow-[var(--shadow-panel)]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
