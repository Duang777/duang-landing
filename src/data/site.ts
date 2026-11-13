export const BLOG_URL = "https://duangblog.pages.dev/";
export const GITHUB_URL = "https://github.com/Duang777";
export const RSS_URL = "https://duangblog.pages.dev/rss.xml";

export const nav = [
  { label: "文章", href: "#articles" },
  { label: "专栏", href: "#columns" },
  { label: "精选", href: "#lab" },
  { label: "关于", href: "#about" },
] as const;

export const profile = {
  name: "Duang",
  /** Follows "我是 Duang，" in the intro line. */
  line: "你好。",
  focus: "全栈 / Agent 工程",
} as const;

/** `series` is the title prefix shared by a column's numbered posts, used to count them. */
export const columns = [
  {
    name: "Agent 拆解",
    href: "https://duangblog.pages.dev/posts/agent-breakdown/",
    blurb: "从单轮循环到多智能体拓扑，每篇带真实路径、核心代码和工程取舍。",
    series: null,
  },
  {
    name: "Agent 系统架构设计",
    href: "https://duangblog.pages.dev/posts/agent-system-architecture/",
    blurb: "不绑框架，从定义、光谱到支柱与可靠性，拆开再装回去。",
    series: "Agent 系统架构设计（",
  },
  {
    name: "Pi 深度解析",
    href: "https://duangblog.pages.dev/posts/pi-deep-dive/",
    blurb: "顺着包边界读 Pi coding agent harness 的实现。",
    series: "Pi 深度解析（",
  },
  {
    name: "高性能后端实战",
    href: "https://duangblog.pages.dev/posts/perf-backend/",
    blurb: "从度量尺子到 CPU、内存、并发和 IO，Python / Go 对照。",
    series: "高性能后端实战（",
  },
  {
    name: "MySQL 深度教学",
    href: "https://duangblog.pages.dev/posts/mysql-column/",
    blurb: "从一条 SQL 把架构、引擎、索引、事务和锁走一遍。",
    series: "MySQL 深度教学（",
  },
  {
    name: "易混专栏",
    href: "https://duangblog.pages.dev/posts/dont-mix/",
    blurb: "把容易搅在一起的概念拆开，目前在讲进程、线程、协程。",
    series: "进程、线程、协程详解",
  },
] as const;

/** Column landing pages and stubs that should not show up as articles. */
export const nonArticleHrefs = new Set<string>([
  ...columns.map((c) => c.href),
  "https://duangblog.pages.dev/posts/latest-digest/",
  "https://duangblog.pages.dev/posts/backend-column/",
]);

export const featured = [
  {
    tag: "前端实验室",
    title: "用原生 WebGL 跑 24,000 个粒子",
    image: "/images/duang-webgl-particles.png",
    href: "https://duangblog.pages.dev/posts/webgl-particle-shader/",
  },
  {
    tag: "最新速递",
    title: "MCP 草案改了什么：会话和握手都被删掉了",
    image: "/images/duang-agent-network.png",
    href: "https://duangblog.pages.dev/posts/mcp-draft-session-handshake-removed/",
  },
  {
    tag: "后端专栏",
    title: "后端架构深度解析（Go 篇）：用 goroutine 和接口把高并发写进骨架",
    image: "/images/duang-terminal-editorial.png",
    href: "https://duangblog.pages.dev/posts/backend-arch-go/",
  },
] as const;
