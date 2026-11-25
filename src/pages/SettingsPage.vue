<template>
  <AppShell>
    <div class="page settings">
      <header class="page-head">
        <div>
          <p class="eyebrow">settings</p>
          <h1 class="h1">我的</h1>
        </div>
      </header>

      <section class="card profile">
        <PetAvatar :species="settings.profile.petSpecies" :size="64" :name="settings.profile.petName" />
        <div class="profile-copy">
          <strong>{{ settings.profile.petName || '小步' }}</strong>
          <span class="muted small">同桌 · 幼年</span>
        </div>
        <span class="tag">改名卡在宠物页</span>
      </section>

      <section class="card section">
        <div class="section-head">
          <h2 class="h3">你的名字</h2>
          <span class="muted small">首页显示</span>
        </div>
        <div class="name-row">
          <input
            v-model="userNameDraft"
            class="input"
            maxlength="12"
            placeholder="比如：小林、阿灯、Sky"
            autocomplete="off"
          />
          <button class="btn btn-sm" type="button" @click="saveUserName">保存</button>
        </div>
      </section>

      <section class="card section">
        <div class="section-head">
          <h2 class="h3">每日新词</h2>
          <span class="muted small">{{ daily }} 个</span>
        </div>
        <input v-model.number="daily" class="input" type="range" min="10" max="100" step="5" />
        <div class="range-labels">
          <span>10</span>
          <span>20（推荐）</span>
          <span>100</span>
        </div>
        <button class="btn btn-sm" type="button" @click="saveDaily">保存</button>
      </section>

      <section class="card section">
        <div class="section-head">
          <h2 class="h3">主题</h2>
          <span class="muted small">跟着时间走</span>
        </div>
        <div class="theme-row">
          <button
            v-for="option in themes"
            :key="option.value"
            class="theme-btn"
            :class="{ active: settings.profile.theme === option.value }"
            type="button"
            @click="settings.setTheme(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </section>

      <section class="card section">
        <div class="section-head">
          <h2 class="h3">词汇量</h2>
          <span class="muted small">{{ vocabLabel }}</span>
        </div>
        <p class="muted small">
          {{
            settings.profile.estimatedVocab
              ? `估算约 ${settings.profile.estimatedVocab} 词；新词难度会按这个水平选择。`
              : '还没有测过词汇量。测一次后会调整新词难度。'
          }}
        </p>
        <RouterLink to="/onboarding?retest=1" class="btn btn-sm">重新测试</RouterLink>
      </section>

      <section class="card section">
        <div class="section-head">
          <h2 class="h3">AI 批改（可选）</h2>
          <span class="muted small">{{ ai.hasKey ? '已保存 Key' : '未配置' }}</span>
        </div>
        <label class="check-row">
          <input v-model="ai.config.enabled" type="checkbox" @change="ai.save()" />
          <span>启用 AI 深度批改</span>
        </label>
        <p class="muted small">
          默认关闭。开启后写作页会出现「AI 深度批改」按钮；失败会自动回退规则批改。
          Key 只存本机，不进代码、不进构建产物、不进导出文件。
        </p>
        <label class="field">
          <span class="field-label">Base URL</span>
          <input v-model="baseUrl" class="input" autocomplete="off" @blur="saveEndpoint" />
        </label>
        <label class="field">
          <span class="field-label">模型</span>
          <input v-model="model" class="input" autocomplete="off" @blur="saveEndpoint" />
        </label>
        <label class="field">
          <span class="field-label">API Key</span>
          <input
            v-model="keyDraft"
            class="input"
            type="password"
            autocomplete="new-password"
            :placeholder="ai.hasKey ? '已保存；留空表示不改' : '粘贴你的 DeepSeek Key'"
          />
        </label>
        <div class="data-actions">
          <button class="btn btn-sm" type="button" @click="saveKey">保存 Key</button>
          <button class="btn btn-sm" type="button" :disabled="testing" @click="testAI">
            {{ testing ? '测试中…' : '测试连接' }}
          </button>
          <button class="btn btn-danger btn-sm" type="button" @click="clearKey">清除 Key</button>
        </div>
        <p v-if="aiStatus" class="ai-status" role="status" aria-live="polite">{{ aiStatus }}</p>
      </section>

      <section class="card section">
        <div class="section-head">
          <h2 class="h3">数据</h2>
          <span class="muted small">只在本机</span>
        </div>
        <p class="muted small">
          学习数据存在浏览器 IndexedDB 里，不上传。可以导出 JSON 备份；导入会覆盖本机数据。
          AI Key 不会进入备份。
        </p>
        <div class="data-actions">
          <button class="btn btn-sm" type="button" :disabled="backupBusy" @click="exportData">
            {{ backupBusy ? '处理中…' : '导出备份' }}
          </button>
          <button class="btn btn-sm" type="button" :disabled="backupBusy" @click="pickImport">
            导入备份
          </button>
          <button class="btn btn-danger btn-sm" type="button" @click="resetData">清空数据</button>
          <input
            ref="fileInput"
            class="file-input"
            type="file"
            accept=".json,application/json"
            @change="importData"
          />
        </div>
        <p v-if="backupReminder" class="backup-reminder">{{ backupReminder }}</p>
        <p v-if="backupStatus" class="ai-status" role="status" aria-live="polite">
          {{ backupStatus }}
        </p>
      </section>

      <p class="about">
        SkyStep v0.1 · 本地优先 · 开源<br />
        词典数据：ECDICT（MIT）<br />
        sky above, step below
      </p>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import PetAvatar from '@/components/PetAvatar.vue'
import { db } from '@/db/db'
import { AIError } from '@/domain/ai'
import { VOCAB_LEVEL_LABELS } from '@/data/vocabulary'
import { collectBackup, downloadBackup, restoreBackup } from '@/services/backup'
import { useAIStore } from '@/stores/ai'
import { useSettingsStore, type ThemeMode } from '@/stores/settings'

const settings = useSettingsStore()
const ai = useAIStore()
const daily = ref(settings.profile.dailyNewWords)
const userNameDraft = ref(settings.profile.userName)
const baseUrl = ref(ai.config.baseUrl)
const model = ref(ai.config.model)
const keyDraft = ref('')
const aiStatus = ref('')
const testing = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const backupBusy = ref(false)
const backupStatus = ref('')
const lastBackupAt = ref(0)

const backupReminder = computed(() => {
  if (!lastBackupAt.value) return '还没有备份过，建议先导出一份。'
  const days = Math.floor((Date.now() - lastBackupAt.value) / 86_400_000)
  if (days >= 7) return `上次备份是 ${days} 天前，建议再导出一份。`
  return ''
})

const vocabLabel = computed(() => {
  if (!settings.profile.estimatedVocab) return '未测试'
  return `${VOCAB_LEVEL_LABELS[settings.profile.vocabLevel]} · ${settings.profile.estimatedVocab} 词`
})

onMounted(async () => {
  await ai.load()
  baseUrl.value = ai.config.baseUrl
  model.value = ai.config.model
  const backupRow = await db.settings.get('backup')
  const saved = (backupRow?.value as { lastBackupAt?: number } | undefined)?.lastBackupAt
  lastBackupAt.value = typeof saved === 'number' ? saved : 0
})

const themes: Array<{ value: ThemeMode; label: string }> = [
  { value: 'auto', label: '自动' },
  { value: 'day', label: '白天' },
  { value: 'night', label: '夜晚' },
]

async function saveUserName() {
  await settings.setUserName(userNameDraft.value)
  userNameDraft.value = settings.profile.userName
}

async function saveDaily() {
  await settings.setDailyNewWords(daily.value)
  daily.value = settings.profile.dailyNewWords
}

async function saveEndpoint() {
  await ai.update({
    baseUrl: baseUrl.value.trim() || 'https://api.deepseek.com',
    model: model.value.trim() || 'deepseek-chat',
  })
  baseUrl.value = ai.config.baseUrl
  model.value = ai.config.model
  aiStatus.value = '已保存接口设置'
}

async function saveKey() {
  const key = keyDraft.value.trim()
  if (!key) {
    aiStatus.value = '请输入新的 Key'
    return
  }
  await ai.update({ apiKey: key, enabled: true })
  keyDraft.value = ''
  aiStatus.value = 'Key 已保存到本机'
}

async function clearKey() {
  await ai.clearKey()
  keyDraft.value = ''
  aiStatus.value = 'Key 已清除'
}

async function testAI() {
  if (keyDraft.value.trim()) {
    await ai.update({ apiKey: keyDraft.value.trim() })
  }
  testing.value = true
  aiStatus.value = '正在测试连接…'
  try {
    await ai.test()
    aiStatus.value = '连接成功'
  } catch (error) {
    aiStatus.value = error instanceof AIError ? error.message : '连接失败'
  } finally {
    testing.value = false
  }
}

async function exportData() {
  backupBusy.value = true
  backupStatus.value = '正在整理备份…'
  try {
    const backup = await collectBackup()
    downloadBackup(backup)
    const now = Date.now()
    lastBackupAt.value = now
    try {
      await db.settings.put({ key: 'backup', value: { lastBackupAt: now } })
    } catch {
      // The downloaded file is the source of truth.
    }
    backupStatus.value = `已导出：${backup.counts.wordbook} 个单词、${backup.counts.cards} 张卡、${backup.counts.submissions} 次写作。`
  } catch (error) {
    backupStatus.value = error instanceof Error ? error.message : '导出失败。'
  } finally {
    backupBusy.value = false
  }
}

function pickImport() {
  fileInput.value?.click()
}

async function importData(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 20 * 1024 * 1024) {
    backupStatus.value = '备份文件太大（上限 20 MB）。'
    input.value = ''
    return
  }
  if (!window.confirm('导入会覆盖本机所有学习数据，确定继续？')) {
    input.value = ''
    return
  }
  backupBusy.value = true
  backupStatus.value = '正在导入…'
  try {
    const counts = await restoreBackup(await file.text())
    backupStatus.value = `已导入：${counts.wordbook} 个单词、${counts.cards} 张卡。即将刷新页面。`
    window.setTimeout(() => window.location.reload(), 900)
  } catch (error) {
    backupStatus.value = error instanceof Error ? error.message : '导入失败。'
    input.value = ''
  } finally {
    backupBusy.value = false
  }
}

async function resetData() {
  const ok = window.confirm('清空本机所有学习数据？这会删除卡片、复习记录和宠物。')
  if (!ok) return
  await db.delete()
  window.location.reload()
}
</script>

<style scoped>
.settings {
  display: grid;
  gap: 12px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-copy {
  display: grid;
  flex: 1;
  gap: 1px;
}

.profile-copy strong {
  font-size: 17px;
  font-weight: 650;
}

.name-row {
  display: flex;
  gap: 8px;
}

.name-row .input {
  flex: 1;
  min-width: 0;
}

.section {
  display: grid;
  gap: 12px;
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 11px;
}

.theme-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

.theme-btn {
  min-height: 40px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.theme-btn.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.data-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-2);
  font-size: 13px;
}

.check-row input {
  width: 18px;
  height: 18px;
  accent-color: var(--accent);
}

.ai-status {
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface-2);
  color: var(--ink-2);
  font-size: 12px;
  line-height: 1.5;
}

.file-input {
  display: none;
}

.backup-reminder {
  padding: 7px 10px;
  border: 1px dashed var(--line);
  border-radius: 9px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.about {
  padding: 12px 2px 0;
  color: var(--muted);
  font-family: var(--font-serif);
  font-size: 12px;
  font-style: italic;
  line-height: 1.7;
  text-align: center;
}
</style>
