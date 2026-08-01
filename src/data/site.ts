export const navMain: Array<{
  label: string;
  href: string;
  active?: boolean;
}> = [
  { label: "首页", href: "#top", active: true },
  { label: "关于", href: "#about" },
  { label: "专栏", href: "#columns" },
  { label: "文章", href: "#articles" },
  { label: "实验", href: "#experiments" },
];

export const BLOG_URL = "https://duangblog.pages.dev/";

export const navSide = [
  { label: "笔记", href: BLOG_URL },
  { label: "GitHub", href: "https://github.com/Duang777" },
] as const;

export const partners = [
  {
    name: "Agent 项目拆解",
    href: "https://duangblog.pages.dev/posts/orloj-breakdown/",
  },
  {
    name: "后端专栏",
    href: "https://duangblog.pages.dev/posts/request-crossing/",
  },
  {
    name: "请求过境",
    href: "https://duangblog.pages.dev/posts/context-to-db/",
  },
  {
    name: "最新速递",
    href: "https://duangblog.pages.dev/posts/mcp-draft-session-handshake-removed/",
  },
  {
    name: "前端实验室",
    href: "https://duangblog.pages.dev/posts/webgl-particle-shader/",
  },
  {
    name: "全栈学习",
    href: "https://duangblog.pages.dev/posts/fullstack-learning/",
  },
  {
    name: "工程化",
    href: "https://duangblog.pages.dev/posts/",
  },
  {
    name: "Idea 与日常",
    href: "https://duangblog.pages.dev/posts/how-i-break-down-agent-projects/",
  },
] as const;

export const products = [
  {
    tag: "前端实验室",
    title: "用原生 WebGL 跑 24,000 个粒子",
    body: "初始数据丢给 GPU，位置在顶点着色器里算。文里有一份能直接点开的演示。",
    href: "https://duangblog.pages.dev/posts/webgl-particle-shader/",
  },
  {
    tag: "最新速递",
    title: "MCP 草案改了什么",
    body: "对照 2025-11-25 那版，会话、握手、MRTR 删掉之后，实现上要动哪些地方。",
    href: "https://duangblog.pages.dev/posts/mcp-draft-session-handshake-removed/",
  },
  {
    tag: "请求过境",
    title: "Context 怎么传到数据库查询",
    body: "Request.Context 和 QueryContext 怎么对上，取消信号怎么进到查询里。",
    href: "https://duangblog.pages.dev/posts/context-to-db/",
  },
  {
    tag: "后端专栏",
    title: "HTTP 超时到底卡在哪",
    body: "ReadHeaderTimeout、ReadTimeout、WriteTimeout、IdleTimeout，各自卡在请求的哪一段。",
    href: "https://duangblog.pages.dev/posts/request-crossing/",
  },
  {
    tag: "Agent 拆解",
    title: "拆 Orloj",
    body: "Agent 循环、多 Agent 路由、工具边界，以及 Go 控制面、Postgres 租约和 React 控制台。",
    href: "https://duangblog.pages.dev/posts/orloj-breakdown/",
  },
  {
    tag: "方法",
    title: "我怎么拆一个 Agent 项目",
    body: "先看目标，再顺着执行路径看工具、记忆、模型、边界和失败时怎么办。",
    href: "https://duangblog.pages.dev/posts/how-i-break-down-agent-projects/",
  },
  {
    tag: "全栈学习",
    title: "先把一条请求跑通",
    body: "页面发请求，服务处理，读写数据，返回结果。先跑通这一条，再换中间的技术。",
    href: "https://duangblog.pages.dev/posts/fullstack-learning/",
  },
] as const;

export const workflows = [
  {
    title: "Agent 项目拆解",
    body: "看别人怎么做，自己怎么搭。",
  },
  {
    title: "后端专栏",
    body: "服务端机制。含请求过境。",
  },
  {
    title: "前端实验室",
    body: "演示为主，少空讲。",
  },
  {
    title: "全栈与工程化",
    body: "前后端和落地时的经验。",
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
    links: ["GitHub Duang777", "笔记站 duangblog", "本站 duang-landing"],
  },
] as const;
