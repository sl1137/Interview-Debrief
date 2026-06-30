# 面试复盘教练 · Interview Debrief Coach

一个 AI 面试复盘工具:上传面试转录、连接你的项目经历,获得**温和但具体**的复盘报告——
告诉你面试官在评估什么、哪些回答偏弱、为什么弱、怎么重写、该练哪些追问,并长期追踪反复出现的薄弱点。

> 它不是会议纪要工具。核心价值是把**转录 + JD + 公司背景 + 简历 + 项目经历**结合起来,
> 给出公平、具体、可执行的面试辅导。

## 功能

- **总览 (`/dashboard`)** — pastel 风格仪表盘:数据磁贴、最近复盘、建议练习、反复出现的薄弱点
- **项目经历库 (`/projects`)** — 为每个项目建卡(背景 / 限制 / 面试准备),AI 复盘时用作上下文,避免不公平的评价
- **新建复盘 (`/interviews/new`)** — 多步表单:基本信息 → JD/公司 → 转录 → 关联项目 → 自我反思 → 生成报告
- **复盘报告 (`/interviews/[id]`)** — 整体复盘、问题清单、重点问题深入拆解、重写回答、模拟追问、薄弱点标签、练习计划
- **成长追踪 (`/growth`)** — 跨多场面试聚合薄弱点、问题类型、岗位方向
- **我的简历 (`/profile`)** — 上传 PDF,浏览器本地解析出文字并识别成简历版式(可编辑)

## 技术栈

- [Next.js 16](https://nextjs.org/)(App Router)+ React 19 + TypeScript
- Tailwind CSS v4
- 数据暂存在浏览器 `localStorage`(无需后端 / 登录)
- `pdfjs-dist` 客户端 PDF 文本解析

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:4173 即可(默认端口已设为 4173)。

## 当前状态

- **AI 分析为 mock**:报告由 `lib/mock-report.ts` 的 `generateMockInterviewDebrief()` 生成——
  它会读取转录和关联项目卡(含项目限制),产出结构化、措辞贴合的报告,但还不是真实大模型。
  接入真实 [Claude](https://www.anthropic.com/) 时只需替换这一个函数。
- 数据存在 `localStorage`,刷新不丢;换浏览器/设备不同步。

## 路线图

- [ ] 接入真实 Claude 分析(替换 mock 函数,并把简历喂入上下文)
- [ ] 数据库持久化(当前 localStorage)
- [ ] 简历结构化交给 AI(当前为启发式)

## 目录结构

```
app/            页面与路由(dashboard / projects / interviews / growth / profile)
components/     UI 组件、表单、侧边栏、图标
lib/            类型、localStorage 存储、mock 报告、分析聚合、PDF 解析
public/         pdf.js worker
```
