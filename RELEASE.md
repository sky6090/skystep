# RELEASE

SkyStep v1 发布前检查与 GitHub Pages 部署步骤。

> 部署状态：已推送到 `sky6090/skystep`，GitHub Actions 构建/部署成功；线上地址 https://sky6090.github.io/skystep/ 。远程使用 SSH 443 + `.deploy/skystep_deploy`（私钥被 `.gitignore` 忽略）。

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
- [ ] `DATA_SOURCES.md` 的 ECDICT 18,181 词条来源与 MIT 归属已核对；CET-4 + CET-6 并集 5,802；其余例句/短语仍为空。
- [ ] 文章 / 题目为原创或已确认授权。

## 2. 创建 GitHub 仓库和部署密钥

1. 在 GitHub 新建 **public** 仓库，例如 `skystep`（不要勾选 README / .gitignore / license）。
2. 仓库 → Settings → **Deploy keys** → Add deploy key：
   - Title：`SkyStep deploy`
   - Key：本机 `.deploy/skystep_deploy.pub` 的内容
   - 勾选 **Allow write access**
3. 仓库 → Settings → Pages：
   - Source 选择 **GitHub Actions**。
4. 本机添加 remote 并推送（通过 SSH 443，绕过当前 HTTPS 网络问题）：

```bash
GIT=".tools/git/cmd/git.exe"
"$GIT" remote add origin ssh://git@ssh.github.com:443/<你的用户名>/skystep.git
"$GIT" push -u origin main
```

如果仓库名不是 `skystep`，把 URL 里的 `skystep` 换掉即可；`vite.config.ts` 在 GitHub Actions 里会自动按仓库名生成 base 路径。

## 3. 自动部署

1. 推送 `main` 后，`.github/workflows/deploy.yml` 会自动构建并部署。
2. 部署完成后地址通常是：

```text
https://<你的用户名>.github.io/<仓库名>/
```

3. 如果 Actions 失败，先看 Actions 日志里的 `pnpm install` / `pnpm build`；本地 `pnpm build` 已通过。当前 `base` 本地 fallback 是 `/skystep/`，GitHub Actions 会按真实仓库名覆盖。

## 4. 发布后验证

- [ ] 首页、`/learn`、`/review`、`/writing`、`/practice`、`/exam`、`/pet`、`/shop`、`/wordbook`、`/dictionary`、`/settings` 刷新不 404。
- [ ] 安装 PWA 后断网仍可打开。
- [ ] 导出的备份能在另一台浏览器导入。
- [ ] `sw.js` 更新后不会卡在旧版本（`registerType: 'autoUpdate'`）。

## 5. 已知边界

- 词典 18,181 条来自 ECDICT（MIT）；CET-4 + CET-6 并集 5,802；词形变化已做，其余例句、短语、同反义仍为空。
- 阅读 3 套题、写作 100 篇；词典大部分例句/短语仍为空。
- 错题排期是 1/3/7 天，和单词 FSRS 分开。
- 没有社交、后端、听力。
