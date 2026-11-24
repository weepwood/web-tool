# My Tools

个人知识管理与生产力工具集，纯静态站点：**零构建、零依赖安装**，每个工具是一个自包含的 HTML 文件，可直接部署到任意静态托管（Netlify / GitHub Pages / Vercel 等）。

## 工具列表

| 文件 | 说明 |
|---|---|
| `index.html` | 工具集门户首页 |
| `json-formatter.html` + `json-core.mjs` | 本地 JSON 格式化、压缩与校验（JavaScript 数字精度，非无损转换） |
| `subtitle-converter.html` | ASS 字幕文本提取，用于后续 AI 处理 |
| `notion-csv-parser.html` | Notion 导出 CSV 解析、浏览、搜索、筛选、导出 |
| `todo.html` | 极简待办管理（ZenTask），localStorage 持久化 |
| `pomodoro.html` | Fluent UI 番茄钟，支持工作/短休/长休模式 |
| `snake.html` + `snake-game.mjs` | 经典贪吃蛇（逻辑层与 UI 层分离，附单元测试） |
| `thought_links.html` | 一次性思维链接分析报告（历史产物，无首页入口） |

## 本地运行

**推荐方式：起一个本地静态服务器**（部分页面依赖 ES Module，`file://` 直接双击会因浏览器 CORS 限制无法加载）：

```powershell
# PowerShell / Windows
python -m http.server 8000
# 然后访问 http://localhost:8000
```

```bash
# macOS / Linux
python3 -m http.server 8000
# 或
npx serve .
```

> 说明：`snake.html` 通过 `<script type="module">` 导入 `snake-game.mjs`，必须通过 HTTP 访问才能运行；JSON 格式化也使用 ES Module；其他页面请按各自依赖情况选择 HTTP 访问。

## 测试

贪吃蛇逻辑及共享逻辑模块使用 Node 内置测试框架：

```bash
node --test
```

## 部署

所有文件为静态资源，直接拖入任意静态托管平台即可。三个外链工具（语雀导出、URL Scheme 转换、Spine 预览）分别部署在独立的 Netlify 站点。

## 开发约定

- 新增工具：单个自包含 HTML 文件，放入仓库根目录，并在 `index.html` 的 `toolsData` 数组中登记入口。
- 有可测试的纯逻辑：抽取为 `.mjs` 模块（参考 `snake-game.mjs`），页面用 `<script type="module">` 引入，并配套 `*.test.mjs`（`node:test`）。
- 用户数据渲染进 DOM 时一律转义（参考各页面 `escapeHtml`），禁止直接拼 `innerHTML`。
- 引用外部 CDN 时锁定具体版本号。
- 设计统一（Notion 风）：
  - 主色 `#2383e2`（暗色 `#4ea1ff`），文字 `#37352f`（暗色 `#e8e6e3`），背景白/`#191919`；
  - 字体统一系统栈（`-apple-system, BlinkMacSystemFont, "Segoe UI", ...`），不引入外部字体；
  - 全部页面通过 `prefers-color-scheme` 支持暗色模式；
  - 图标使用 Phosphor 内联 SVG（参考 `index.html` 的 `ICON` 常量），不手绘、不用 emoji 代替图标体系。
