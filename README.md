# Duang Landing

Duang 的桌面端落地页。基于 Cantor8 的版式，换成博客配色、文章选读和标本瓶风格。站点是纯前端，用 Next.js 静态导出，部署在 Cloudflare Pages。

线上地址：https://duang-landing.pages.dev

## 本地开发

需要 Node.js 24 或更高版本。

```bash
npm install
npm run dev
```

本地开发地址一般是 `http://localhost:3000`。

本地先构建，再预览静态产物：

```bash
npm run build
npm run start
```

`npm run build` 会生成 `out/` 目录。`npm run start` 会在 `http://localhost:3456` 预览这个目录。

## 部署到 Cloudflare Pages

当前仓库已经接好自动部署。往 `master` 推送后，GitHub Actions 会构建并发布到 Cloudflare Pages。

### 自动部署（推荐）

1. 改代码并推到 `master`：

```bash
git add .
git commit -m "your message"
git push origin master
```

2. 打开 GitHub Actions，确认 `Deploy to Cloudflare Pages` 跑成功。
3. 打开 https://duang-landing.pages.dev 查看结果。

也可以在 GitHub 仓库页打开 **Actions**，选 **Deploy to Cloudflare Pages**，再点 **Run workflow** 手动触发一次。

### GitHub Secrets

仓库需要这两个 Secrets：

| Secret 名 | 作用 |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token，用来发布 Pages |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账号 ID |

创建 API Token 的步骤：

1. 打开 https://dash.cloudflare.com/profile/api-tokens
2. 选 **Create Token**
3. 用 **Edit Cloudflare Workers** 模板，或自己配权限
4. 权限至少包含：
   - Account → Cloudflare Pages → Edit
   - Account → Workers Scripts → Edit
   - Account → Account Settings → Read
5. Account Resources 选 Include，再选你的 Cloudflare 账号
6. 创建后复制 Token

Account ID 在 Cloudflare Dashboard 右侧的账号概览里可以看到。

把值写进 GitHub：

1. 打开仓库 **Settings → Secrets and variables → Actions**
2. 新建或更新 `CLOUDFLARE_API_TOKEN`
3. 新建或更新 `CLOUDFLARE_ACCOUNT_ID`

### 本机手动发布

如果只想本机上传，不走 GitHub Actions：

```bash
npm run build
npx wrangler pages deploy out --project-name=duang-landing
```

第一次用 wrangler 时，先登录：

```bash
npx wrangler login
```

### Cloudflare 项目设置

| 项 | 值 |
| --- | --- |
| 项目名 | `duang-landing` |
| 构建命令 | `npm run build` |
| 输出目录 | `out` |
| Node 版本 | `24` |
| 生产分支 | `master` |

## 常用命令

```bash
npm run dev        # 本地开发
npm run build      # 生成静态站点到 out/
npm run start      # 预览 out/
npm run lint       # ESLint
npm run typecheck  # TypeScript 检查
npm run check      # lint + typecheck + build
```

## 项目结构

```
src/
  app/                 # 页面入口和全局样式
  components/site/     # 落地页各区块
  data/site.ts         # 文案和链接
  lib/                 # 工具，例如滚动帧
public/
  brand/               # 品牌资源
  images/              # 图片
  _headers             # Cloudflare 缓存头
.github/workflows/
  deploy-pages.yml     # 自动部署到 Cloudflare Pages
docs/research/         # 复刻时的设计记录
```

## 关于模板能力

这个仓库最初来自 Duang Landing。如果还要用 `/clone-website` 复刻别的站点，看 `AGENTS.md`。当前默认内容是 Duang 落地页，不是空白模板演示。

## License

MIT
