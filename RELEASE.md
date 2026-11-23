# RELEASE

SkyStep v1 发布前检查与 GitHub Pages 部署步骤。

> 当前环境备注：本机没有 `git` / `gh`，`winget` 下载 Git 时 GitHub 连接超时。因此仓库尚未初始化、也未推送；代码和 `dist/` 构建产物已经就绪，部署需在能访问 GitHub 的环境执行下面的步骤。

## 1. 发布前检查

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

- [ ] 构建通过，`dist/` 里有 `index.html`、`404.html`、`sw.js`、`manifest.webmanifest`。
- [ ] 预览地址能完成：首次启动 → 学新词 → 复习 → 写作 → 模考 → 宠物结算。
- [ ] 设置页导出备份，确认 JSON 里没有 `apiKey`。
- [ ] 手机宽度 375px 下，底部导航不遮内容，模考下拉框可用。
- [ ] 断网刷新 `/skystep/practice` 仍能打开（PWA 已安装时）。
- [ ] `DATA_SOURCES.md` 的 ECDICT 18,000 词条来源与 MIT 归属已核对；例句/短语仍为空。
- [ ] 文章 / 题目为原创或已确认授权。

## 2. 创建 GitHub 仓库

1. 在 GitHub 新建 public 仓库，例如 `skystep`。
2. 如果仓库名不是 `skystep`，修改 `vite.config.ts` 的 `base` 和 `index.html` 里的路径。
3. 本地初始化并推送：

```bash
git init -b main
git add .
git commit -m "SkyStep v1"
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

## 3. 开启 GitHub Pages

1. 仓库 → Settings → Pages。
2. Source 选择 **GitHub Actions**。
3. 推送 `main` 后，`.github/workflows/deploy.yml` 会自动构建并部署。
4. 部署完成后地址通常是：

```text
https://<你的用户名>.github.io/<仓库名>/
```

当前 `base` 是 `/skystep/`，对应仓库名 `skystep`。

## 4. 发布后验证

- [ ] 首页、`/learn`、`/review`、`/writing`、`/practice`、`/exam`、`/pet`、`/shop`、`/wordbook`、`/dictionary`、`/settings` 刷新不 404。
- [ ] 安装 PWA 后断网仍可打开。
- [ ] 导出的备份能在另一台浏览器导入。
- [ ] `sw.js` 更新后不会卡在旧版本（`registerType: 'autoUpdate'`）。

## 5. 已知边界

- 词典 18,000 条来自 ECDICT（MIT）；例句、短语、同反义仍为空，词形还原未做。
- 阅读 3 套题、写作 70 篇，离 PRD 的 100 篇还有距离。
- 错题排期是 1/3/7 天，和单词 FSRS 分开。
- 没有社交、后端、听力。
