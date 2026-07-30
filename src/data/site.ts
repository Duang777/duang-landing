export const navMain: Array<{
  label: string;
  href: string;
  active?: boolean;
}> = [
  { label: "首页", href: "#top", active: true },
  { label: "文章", href: "#articles" },
  { label: "专栏", href: "#columns" },
  { label: "实验", href: "#experiments" },
  { label: "关于", href: "#about" },
];

export const navSide = [
  { label: "归档", href: "https://duangblog.pages.dev/archives/" },
  { label: "GitHub", href: "https://github.com/Duang777" },
] as const;

export const partners = [
  "Agent 项目拆解",
  "后端专栏",
  "请求过境",
  "最新速递",
  "前端实验室",
  "全栈学习",
  "工程化",
  "Idea 与日常",
] as const;

export const products = [
  {
    tag: "前端实验室",
    title: "用原生 WebGL 跑 24,000 个粒子",
    body: "把初始数据交给 GPU，再用顶点着色器完成每一帧的位置计算。文章内有可直接操作的完整演示。",
    href: "https://duangblog.pages.dev/posts/webgl-particle-shader/",
  },
  {
    tag: "最新速递",
    title: "MCP 草案改了什么",
    body: "对比 2025-11-25 版本，逐项看会话、握手、MRTR 被移除后，对客户端和服务端实现意味着什么。",
    href: "https://duangblog.pages.dev/posts/mcp-draft-session-handshake-removed/",
  },
  {
    tag: "请求过境",
    title: "Context 怎么传到数据库查询",
    body: "对照 Request.Context 和 database/sql 的 QueryContext，说明取消信号如何从 Handler 传进查询。",
    href: "https://duangblog.pages.dev/posts/context-to-db/",
  },
  {
    tag: "后端专栏",
    title: "HTTP 超时到底卡在哪",
    body: "把 ReadHeaderTimeout、ReadTimeout、WriteTimeout 和 IdleTimeout 放回一次真实请求的路径里。",
    href: "https://duangblog.pages.dev/posts/request-crossing/",
  },
  {
    tag: "Agent 拆解",
    title: "拆 Orloj",
    body: "细拆 Agent 循环、多 Agent 图路由、工具治理，以及 Go 控制面、Postgres 租约和 React 控制台。",
    href: "https://duangblog.pages.dev/posts/orloj-breakdown/",
  },
  {
    tag: "方法",
    title: "我怎么拆一个 Agent 项目",
    body: "面对 Agent 开源项目时，我会先看目标，再沿执行链路拆工具、记忆、模型、边界和失败条件。",
    href: "https://duangblog.pages.dev/posts/how-i-break-down-agent-projects/",
  },
  {
    tag: "全栈学习",
    title: "先把一条链路跑通",
    body: "从页面发起请求，到服务处理、读写数据、返回结果。先走通一条真实链路，再替换中间的技术选型。",
    href: "https://duangblog.pages.dev/posts/fullstack-learning/",
  },
] as const;

export const workflows = [
  {
    title: "Agent 项目拆解",
    body: "不复述 README。顺着单 Agent 循环、多 Agent 路由、工具、记忆、治理和消息交接，把真实实现与取舍讲清楚。",
  },
  {
    title: "后端专栏",
    body: "从服务端机制出发，沿一条请求进入进程后的真实路径，定位超时、取消、连接和数据库查询的边界。",
  },
  {
    title: "前端实验室",
    body: "把浏览器当作实验场。用可运行的交互和短代码说明 WebGL、Shader、动画与性能，而不是只展示结果。",
  },
  {
    title: "全栈与工程化",
    body: "从页面到请求、服务、数据和部署，把前后端边界、失败表现和能复用的工程约定放进同一条链路。",
  },
] as const;

export const news = [
  {
    tag: "前端实验室",
    date: "2026.07.29",
    title: "用原生 WebGL 跑 24,000 个粒子",
    image: "/images/duang-webgl-particles.png",
    href: "https://duangblog.pages.dev/posts/webgl-particle-shader/",
  },
  {
    tag: "最新速递",
    date: "2026.07.28",
    title: "MCP 草案改了什么：会话和握手都被删掉了",
    image: "/images/duang-agent-network.png",
    href: "https://duangblog.pages.dev/posts/mcp-draft-session-handshake-removed/",
  },
  {
    tag: "请求过境",
    date: "2026.07.26",
    title: "Handler 里的 Context 怎么传到数据库查询",
    image: "/images/duang-terminal-editorial.png",
    href: "https://duangblog.pages.dev/posts/context-to-db/",
  },
] as const;

export const footerColumns = [
  {
    title: "浏览",
    links: ["首页", "文章", "归档", "标签", "搜索", "关于"],
  },
  {
    title: "专栏",
    links: [
      "Agent 项目拆解",
      "后端专栏",
      "请求过境",
      "最新速递",
      "前端实验室",
      "全栈学习",
    ],
  },
  {
    title: "语言",
    links: ["中文", "English"],
  },
  {
    title: "联系",
    links: ["GitHub Duang777", "duangblog.pages.dev"],
  },
] as const;
