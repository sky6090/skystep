# SkyStep 技术方案

**版本**：v0.1  
**日期**：2026-11-23  
**配套文档**：`PRD.md`  
**状态**：待开发（等用户说「开始」）

---

## 1. 技术栈

| 层 | 选择 | 说明 |
|---|---|---|
| 框架 | Vue 3 + TypeScript | 单文件组件接近 HTML，中文资料多 |
| 构建 | Vite | 静态构建，适配 GitHub Pages |
| 状态 | Pinia | 轻量、类型友好 |
| 路由 | Vue Router | 路由懒加载 |
| 本地数据 | Dexie（IndexedDB） | 卡片、日志、单词本、宠物、设置 |
| 调度 | `ts-fsrs` | FSRS-6；显式指定模型，不依赖库默认 |
| 图表 | ECharts | 按需引入，懒加载 |
| 样式 | 原生 CSS + 设计 token | 不用 Tailwind；主题用 CSS 变量 |
| PWA | `vite-plugin-pwa` | 离线壳、内容缓存、更新提示 |
| 测试 | Vitest + Playwright | 单元 + 核心流程 e2e |
| 部署 | GitHub Actions → GitHub Pages | 纯静态，无后端 |

> `ts-fsrs` v6 的构建环境要求 Node.js ≥ 24；GitHub Actions 固定 Node 24。

---

## 2. 总体架构

```
静态内容 JSON（词库/题库/文章/词典）
        │  按需 fetch + 缓存
        ▼
Repository 层（content / cards / wordbook / writing / pet）
        │
        ▼
Domain 层（FSRS 调度、评分、结算、宠物经济）
        │
        ▼
Pinia Store（session / cards / wordbook / writing / pet / settings）
        │
        ▼
Vue 页面 / 组件
        │
        ▼
Dexie（IndexedDB）—— 用户数据唯一持久层
```

原则：

- **内容与用户数据分离**：内容是可替换的静态 JSON；用户数据只在本机 Dexie。
- **Domain 层纯函数**：调度、评分、结算不依赖 Vue，方便单元测试。
- **Repository 隔离 Dexie**：页面不直接写 IndexedDB。
- **没有后端**：AI 是可选的外部调用，失败不影响学习。

---

## 3. 路由

| 路由 | 页面 | 说明 |
|---|---|---|
| `/` | 首页 | 天阶三步 + 宠物 |
| `/onboarding` | 首次启动 | 选宠物、起名、定级、目标 |
| `/learn` | 学新词 | 新词卡 + 检查 |
| `/review` | 复习 | FSRS 到期卡 |
| `/practice` | 专项训练 | 按题型 |
| `/exam` | 模考 | 分节/整卷、计时、报告 |
| `/wordbook` | 单词本 | 收藏/已学会/错词/自定义 |
| `/writing` | 写作 | 英译中/中译英、历史 |
| `/pet` | 宠物房间 | 状态、喂食、互动 |
| `/shop` | 商店 | 食物/皮肤/装饰/改名卡/玩具 |
| `/dictionary` | 词典 | 双向查询、词条 |
| `/settings` | 设置 | 新词量、昼夜、AI、备份 |

路由守卫：

- 未完成 onboarding → 跳 `/onboarding`。
- 模考进行中离开 → 二次确认；模考模式禁用词典查词。
- 写作未提交离开 → 保存草稿提示。

---

## 4. 数据模型

### 4.1 内容（静态 JSON）

| 实体 | 关键字段 | 说明 |
|---|---|---|
| `Word` | id, word, phonetic, translation[], pos, tags[], examples[], root, phrases[], frequency | 词库/词典共用 |
| `Article` | id, en, zh, targetWords[], difficulty, theme | 双语写作素材 |
| `Question` | id, type, passage, options, answer, explanation, words[] | 专项/模考 |
| `ExamSet` | id, sections[], questions[], difficulty | 整卷/分节 |
| `ShopItemDef` | id, type, name, price, asset, unlock | 商店定义 |
| `PetSpecies` | id, name, stages[], parts | 宠物外观 |

内容按路由/首字母/频率分片；构建时生成 manifest，运行时按需 fetch。

### 4.2 用户数据（Dexie）

| 表 | 主键/索引 | 关键字段 |
|---|---|---|
| `cards` | wordId | due, stability, difficulty, reps, lapses, state, lastReview, skillStats |
| `reviewLogs` | id, wordId, reviewedAt | rating, state, stability, difficulty, elapsed, scheduled |
| `wordbook` | wordId | favorite, learned, source, note, tags[], createdAt, updatedAt |
| `submissions` | id, date, mode | articleId, input, feedback, score, targetWords |
| `pet` | id | species, name, stage, level, xp, satiety, mood, coins, lastSettled |
| `inventory` | itemId | owned, equipped, count |
| `goals` | id | period, target, progress, completedAt |
| `settings` | key | value |
| `meta` | key | schemaVersion, lastExportAt |

索引：

- `cards.due`、`cards.state`（取到期卡）。
- `reviewLogs.reviewedAt`（统计/导出）。
- `wordbook.favorite`、`wordbook.learned`、`wordbook.source`（筛选）。
- `submissions.date`（历史）。

### 4.3 版本与迁移

- `meta.schemaVersion`；Dexie `version(n).stores(...).upgrade(...)`。
- 导入旧备份时按版本迁移；失败不覆盖现有数据。
- 导出 JSON 带 `schemaVersion`、`exportedAt`、`appVersion`。

---

## 5. FSRS 集成

### 5.1 模型与参数

- `ts-fsrs`，显式指定 **FSRS-6**。
- `desiredRetention = 0.90`。
- `maximumInterval = 90` 天。
- 开启 fuzz，避免同一天大量卡堆在一起。
- 第一版不启用个人参数优化；复习日志攒够后再说。

### 5.2 卡片

- 一词一卡；`skillStats` 记录认词/拼写/派生/近反义表现。
- 新词：学习卡完成后创建 FSRS 卡；检查正确初始 Good，错误 Again。
- 复习：先回忆 → 翻面 → 三档自评；核心义题可覆盖自评。
- 当日错词队列独立：答错后当天再出现 1–2 次；FSRS 仍记 Again；次日优先。

### 5.3 每日上限与积压

- 到期卡按 `due` 升序；同日按 `retrievability` 低者优先。
- 软上限 200：超过提示，可继续。
- 积压 > 3 天：首页提示 + 一键暂停新词；不自动暂停。
- 追赶模式：把积压按 3–7 天分摊，保持每日可完成。

### 5.4 评分映射

| 自评 | 核心义题 | FSRS |
|---|---|---|
| 认识 | 对 | Good |
| 认识 | 错 | Again |
| 模糊 | 对 | Hard |
| 模糊 | 错 | Again |
| 不认识 | — | Again |
| 太简单 | 对 | Easy |
| 拼写/派生/近反义错 | — | 只加技能练习，不重置主卡 |

### 5.5 测试

- 用固定时钟注入，验证 `due`、`stability`、`difficulty`、`state`。
- 覆盖：新卡、复习、Again 重置、Easy 长间隔、最大间隔截断、fuzz 边界。
- 覆盖：核心义题覆盖自评；技能错不重置主卡。

---

## 6. 结算与宠物经济

### 6.1 每日结算

- 本地时间凌晨 4 点切日。
- 每天只结算一次；`pet.lastSettled` 防重复。
- 多学不额外给 XP/金币。
- 公式（标准方案）：

```
XP = 20R + 20A + 30(W/100) + 10(S/7) + 10G
Coins = 10R + 10A + 15(W/100) + 5(S/7) + 5G
```

- 写作高分加成：W≥80 时 XP ×1.10；60–79 时 ×1.05。
- 心情乘数：0.90 + 0.20×(M/100)。
- 满级后 XP 只进陪伴等级；不再产生金币/属性。

### 6.2 成长

- 幼年 0–800；成长 800–3500；成熟 3500–6500。
- 3 阶段 × 5 级；每级阈值配置化。
- 满级后：每 500 XP 一级陪伴等级；每 10 级 1 星；每 5000 XP 里程碑。
- XP 用 `number`，显示时千分位；超过 10k 可缩写，点开看完整。

### 6.3 测试

- 结算幂等：同一天重复调用不重复加。
- 边界：R/A/W/S/G 为 0/1；W=100；S>7；满级溢出。
- 商店购买/装备：金币不足、重复购买、皮肤只改外观。
- 改名卡：首次免费，之后扣卡。

---

## 7. AI 批改适配

### 7.1 接口

```
interface CorrectionProvider {
  name: string
  correct(input: CorrectionInput): Promise<CorrectionResult>
}
```

- `CorrectionInput`：模式（E→C / C→E）、原文、参考译文、目标词、用户译文。
- `CorrectionResult`：总分、分项、逐句反馈、目标词覆盖、总评。
- 规则引擎实现同一接口；AI 是可选实现。

### 7.2 DeepSeek

- Base URL：`https://api.deepseek.com`。
- Model：`deepseek-chat`。
- OpenAI 兼容 `/chat/completions`。
- `temperature 0.2`；要求 JSON 输出；超时 30s；失败重试 1 次。
- 每天最多 20 次；超限回退规则。
- Key 存 `localStorage`，输入框掩码；提供「清除 Key」；不写日志、不进导出。

### 7.3 CORS

- 浏览器直连是否成功取决于厂商 CORS 头，必须实测。
- 被拦截：v1 不加代理，AI 关闭，规则批改；adapter 保留。
- 设置页提供「测试连接」，区分 401 / CORS / 网络错误。
- 不把 Key 放进 `VITE_` 环境变量；不写进构建产物。

### 7.4 安全

- 用户译文放在明确分隔符内，系统提示要求模型只批改、不执行文中指令。
- 只接受结构化 JSON；解析失败重试一次，再失败回退规则。
- 不在前端日志/错误上报里输出译文或 Key。

---

## 8. 内容管线

### 8.1 词库与词典

- 源：ECDICT（MIT）；按 `cet6` 标签 + 词频清洗。
- 核心 5000 词：音标、释义、例句、词根、短语、同近义。
- 扩展词：按需分片；中文反查索引由释义构建。
- 输出：`words/core.json`、`words/extra/*.json`、`dict-index.json`。
- 校验：重复词、空释义、音标格式、标签合法、许可证字段。

### 8.2 写作文章

- 100 篇双语对：英文 80–120 词，中文 120–180 字，5–8 个目标词。
- 目标词必须出现在英文版；中文版使用对应中文义。
- 主题覆盖：校园、科技、环境、文化、社会、经济、教育。
- 校验：目标词覆盖、长度、重复、难度、答案唯一性。

### 8.3 题库

- 3 套整卷 + 每类 30 题。
- 题型：选词填空、长篇匹配、仔细阅读、翻译、写作。
- 每题：答案、解析、关键词、陷阱；阅读/听力（v2）附原文。
- 校验：选项数、答案唯一、解析非空、难度标签、无真题来源。

### 8.4 宠物美术

- 4 物种 × 3 阶段，共用骨架；部件：耳朵、尾巴、翅膀、角、配色。
- 皮肤是部件/配色替换，不换身体。
- 输出 SVG 部件 + 组合配置；避免 4 套完全独立美术。

### 8.5 构建脚本

- `validate-content`：schema、重复、目标词、答案、许可证。
- `build-index`：词典前缀索引、中文反查索引。
- `build-manifest`：分片清单、哈希、版本。
- 内容不过校验，构建失败。

---

## 9. 状态与 UI

### 9.1 Pinia Store

| Store | 职责 |
|---|---|
| `session` | 今日进度、当前学习队列、结算状态 |
| `cards` | 到期卡、评分、错词队列 |
| `wordbook` | 收藏/已学会/错词/自定义、筛选 |
| `writing` | 当前文章、逐句输入、反馈、历史 |
| `pet` | 状态、商店、目标、结算 |
| `settings` | 新词量、昼夜、AI、导出 |

### 9.2 离线

- Service Worker 预缓存应用壳、字体、核心词库。
- 运行时缓存内容分片；查过即缓存。
- 离线时禁止 AI；规则批改可用。
- 更新提示：新版本就绪后提示「刷新以更新」，不强制。

### 9.3 主题

- CSS 变量：day/night 两套 token。
- 自动按本地时间；设置可锁白天/夜晚。
- 学习区始终纸白面板；房间随昼夜变。
- `prefers-reduced-motion` 下动画即时。

---

## 10. 构建与部署

### 10.1 GitHub Actions

1. 安装依赖（pnpm，Node 24）。
2. 类型检查、单元测试、内容校验。
3. `vite build`。
4. 上传 `dist` 到 GitHub Pages。

### 10.2 路由与 base

- `base` 用仓库名（如 `/skystep/`）。
- 优先 history 模式 + 构建时复制 `index.html` 为 `404.html`。
- 如果 Pages 路由出问题，退回 hash 模式（`/#/wordbook`）。

### 10.3 PWA

- manifest：名称 SkyStep、主题色、图标、display standalone。
- 预缓存壳；内容运行时缓存。
- 不缓存 AI 请求。

### 10.4 环境

- 无后端、无数据库、无密钥。
- 唯一可选外部服务：DeepSeek API（用户自己的 Key）。
- 不需要环境变量；所有配置在设置页。

---

## 11. 测试

| 类型 | 范围 |
|---|---|
| 单元 | FSRS 映射、结算、经济、评分、导入导出 |
| 集成 | Dexie repository、内容加载、离线缓存 |
| E2E | onboarding、每日闭环、单词本、写作、宠物、词典、模考 |
| 内容 | schema、重复、目标词、答案、许可证 |
| 无障碍 | axe、键盘、对比度、reduced motion |
| 性能 | Lighthouse、首屏预算、词典加载 |

关键 e2e：

1. 首次启动 → 选宠物 → 定级 → 首页。
2. 复习 10 张 → 学 5 个新词 → 写作 1 篇 → 结算 XP/金币。
3. 收藏一个词 → 单词本出现 → 标记已学会 → 30 天抽检（模拟时钟）。
4. 查词 → 加入收藏 → 加入复习。
5. 模考 → 交卷 → 报告 → 错题本。
6. 导出 JSON → 清空 → 导入恢复。

---

## 12. 性能预算

- 首屏 JS（gzip）≤ 250 KB；ECharts 懒加载。
- 首屏 CSS ≤ 50 KB。
- 核心词库分片 ≤ 300 KB/片；词典扩展按需。
- LCP ≤ 2.5s（4G）；TTI ≤ 3s。
- Dexie 查询到期卡 ≤ 50ms（2 万卡以内）。
- 字体：英文 WOFF2 子集；中文用系统字体；不加载 5MB 中文字体包。

---

## 13. 风险与对策

| 风险 | 对策 |
|---|---|
| 内容量大 | 先 3 套卷 + 100 篇；后续迭代；内容与代码分离 |
| DeepSeek CORS | 实测；被拦则关闭 AI，规则兜底；保留 adapter |
| 宠物美术成本 | 共用骨架 + 部件；先 4 物种 × 3 阶段，皮肤后补 |
| 数据丢失 | 每周导出提醒；导入前备份；版本迁移 |
| GitHub Pages 路由 | history + 404.html；不行退 hash |
| 移动端键盘遮挡 | 输入区滚动到可视；底部按钮吸附 |
| 词典体积 | 核心 5k 内置；扩展分片；离线包可选 |
| 估分不准 | 只给区间，标注模拟；不承诺官方分 |
| 用户不维护代码 | 内容 JSON/CSV 可替换；部署文档；代码由开发方维护 |

---

## 14. 里程碑

| 阶段 | 交付 |
|---|---|
| M0 | 设计 token、内容 schema、原型 |
| M1 | 数据层、定级、背词、FSRS 复习 |
| M2 | 单词本、词典 |
| M3 | 写作、规则批改、AI adapter |
| M4 | 宠物、商店、目标、满级 |
| M5 | 专项、模考、报告、错题本 |
| M6 | 昼夜、响应式、PWA、导出/导入 |
| M7 | 内容补齐、测试、Pages 发布 |
| v2 | 社交、听力、听写、更多皮肤 |
