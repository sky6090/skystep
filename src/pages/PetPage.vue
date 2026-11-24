<template>
  <AppShell>
    <div class="page pet-page">
      <header class="page-head">
        <div>
          <p class="eyebrow">companion</p>
          <h1 class="h1">{{ settings.profile.petName || '小步' }}</h1>
        </div>
        <span class="tag tag-accent">{{ stage.stageLabel }} · Lv.{{ stage.level }}</span>
      </header>

      <section class="pet-room">
        <div class="room-window" aria-hidden="true" />
        <div class="pet-center">
          <PetAvatar
            :species="settings.profile.petSpecies"
            :size="150"
            :name="settings.profile.petName"
            :skin-color="skinColor"
          />
        </div>
        <div class="room-cushion" aria-hidden="true" />
      </section>

      <section class="card stats">
        <div class="stat-row">
          <span class="stat-label">{{ stage.maxed ? '累计经验' : '到下一级' }}</span>
          <span class="stat-value">
            {{ stage.maxed ? pet.state.xp : `${pet.state.xp} / ${stage.nextXp ?? 6500}` }}
          </span>
        </div>
        <div class="progress"><span :style="{ width: `${stage.maxed ? 100 : stage.progress}%` }" /></div>
        <p v-if="stage.maxed" class="caption">
          陪伴 Lv.{{ stage.companionLevel }} · ★{{ stage.stars }} · 里程碑 {{ stage.milestones }}
        </p>
        <p v-else class="caption">
          {{ stage.stage === 'baby' ? '再攒一点就进入成长。' : '再攒一点就成熟。' }}
        </p>

        <div class="meter-row">
          <div class="meter">
            <span class="meter-label">饱食度</span>
            <div class="progress"><span :style="{ width: `${pet.state.satiety}%` }" /></div>
            <span class="meter-value">{{ Math.round(pet.state.satiety) }}</span>
          </div>
          <div class="meter">
            <span class="meter-label">心情</span>
            <div class="progress"><span :style="{ width: `${pet.state.mood}%` }" /></div>
            <span class="meter-value">{{ Math.round(pet.state.mood) }}</span>
          </div>
        </div>

        <div class="resource-row">
          <span>金币 <strong>{{ pet.state.coins }}</strong></span>
          <span>粮食 <strong>{{ pet.foodCount }}</strong></span>
          <span>改名卡 <strong>{{ pet.renameCount }}</strong></span>
        </div>
      </section>

      <p v-if="message" class="status">{{ message }}</p>

      <div class="actions">
        <button class="btn" type="button" :disabled="pet.foodCount === 0" @click="feed">喂食</button>
        <RouterLink to="/shop" class="btn">商店</RouterLink>
        <button class="btn" type="button" @click="interact">摸摸</button>
        <button class="btn" type="button" @click="startRename">改名</button>
      </div>

      <section v-if="renaming" class="card rename-card">
        <label class="field">
          <span class="field-label">新名字（消耗 1 张改名卡）</span>
          <input v-model="nameDraft" class="input" maxlength="12" autocomplete="off" />
        </label>
        <div class="rename-actions">
          <button class="btn btn-primary btn-sm" type="button" @click="confirmRename">确认改名</button>
          <button class="btn btn-ghost btn-sm" type="button" @click="renaming = false">取消</button>
        </div>
      </section>

      <section class="card goals">
        <div class="spread">
          <h2 class="h3">目标</h2>
          <span class="caption">日 / 周 / 阶段</span>
        </div>

        <div class="goal-group">
          <span class="sub-label">日目标</span>
          <div class="goal-list">
            <span
              v-for="item in dailyItems"
              :key="item.label"
              class="goal-chip"
              :class="{ done: item.done }"
            >
              {{ item.label }} {{ item.detail }}
            </span>
          </div>
        </div>

        <div class="goal-group">
          <span class="sub-label">周目标</span>
          <div class="goal-list">
            <span class="goal-chip" :class="{ done: weeklyDays >= 5 }">
              学习 {{ Math.min(weeklyDays, 5) }}/5 天
            </span>
            <span class="goal-chip" :class="{ done: weeklyWritings >= 3 }">
              写作 {{ Math.min(weeklyWritings, 3) }}/3 篇
            </span>
            <button
              class="btn btn-sm"
              type="button"
              :disabled="!weeklyComplete || pet.weeklyClaimed"
              @click="claimWeekly"
            >
              {{ pet.weeklyClaimed ? '本周已领' : '领周奖励' }}
            </button>
          </div>
        </div>

        <div class="goal-group">
          <span class="sub-label">阶段目标</span>
          <div class="goal-line">
            <span>掌握 1000 词</span>
            <div class="progress">
              <span :style="{ width: `${Math.min(100, (learnedCount / 1000) * 100)}%` }" />
            </div>
            <span class="goal-value">{{ learnedCount }}/1000</span>
          </div>
          <div class="goal-line">
            <span>写作 30 天</span>
            <div class="progress">
              <span :style="{ width: `${Math.min(100, (writingDays / 30) * 100)}%` }" />
            </div>
            <span class="goal-value">{{ writingDays }}/30</span>
          </div>
          <button
            class="btn btn-sm"
            type="button"
            :disabled="!stageComplete || pet.stageClaimed"
            @click="claimStage"
          >
            {{ pet.stageClaimed ? '阶段奖励已领' : '领阶段奖励' }}
          </button>
        </div>

        <p class="caption">
          日目标完成结算时 +1 基础粮；阶段皮肤随成长自动解锁。
        </p>
      </section>

      <section class="card settle-card">
        <div class="spread">
          <div>
            <h2 class="h3">今日结算</h2>
            <p class="muted small">
              复习完成率、正确率、写作得分、连续天数一起算经验；每天只结算一次。
            </p>
          </div>
          <button
            class="btn btn-primary btn-sm"
            type="button"
            :disabled="settling || !canSettle"
            @click="settle"
          >
            {{ settledToday ? '已结算' : !hasActivity ? '先学习' : settling ? '结算中…' : '结算今日' }}
          </button>
        </div>
        <p v-if="!hasActivity && !settledToday" class="caption">
          今天还没有学习记录，学完再来结算。
        </p>
        <p v-if="pet.lastAward" class="caption award">
          上次结算：+{{ pet.lastAward.xp }} 经验 · +{{ pet.lastAward.coins }} 金币
        </p>
      </section>

      <p class="footnote">
        饱食度只影响心情和经验加成，不影响背单词、复习、写作。它不会死。
      </p>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import PetAvatar from '@/components/PetAvatar.vue'
import { db } from '@/db/db'
import { studyDayKey } from '@/domain/day'
import { usePetStore } from '@/stores/pet'
import { useSessionStore } from '@/stores/session'
import { useSettingsStore } from '@/stores/settings'

const pet = usePetStore()
const settings = useSettingsStore()
const session = useSessionStore()

const message = ref('')
const renaming = ref(false)
const nameDraft = ref('')
const settling = ref(false)
const weeklyDays = ref(0)
const weeklyWritings = ref(0)
const learnedCount = ref(0)
const writingDays = ref(0)

const stage = computed(() => pet.stageInfo)
const skinColor = computed(() => pet.equippedSkinItem?.color ?? '')
const settledToday = computed(() => pet.state.lastSettledDay === studyDayKey())
const weeklyComplete = computed(() => weeklyDays.value >= 5 && weeklyWritings.value >= 3)
const stageComplete = computed(() => learnedCount.value >= 1000 && writingDays.value >= 30)
const hasActivity = computed(
  () => session.reviewedToday > 0 || session.learnedToday > 0 || session.wroteToday > 0,
)
const canSettle = computed(() => !settledToday.value && hasActivity.value)
const dailyItems = computed(() => [
  {
    label: '新词',
    done: session.learnedToday >= settings.profile.dailyNewWords,
    detail: `${Math.min(session.learnedToday, settings.profile.dailyNewWords)}/${settings.profile.dailyNewWords}`,
  },
  {
    label: '复习',
    done: session.dueCount === 0,
    detail: session.dueCount === 0 ? '已清空' : `${session.dueCount} 待复习`,
  },
  {
    label: '写作',
    done: session.wroteToday > 0,
    detail: `${Math.min(session.wroteToday, 1)}/1`,
  },
])

onMounted(async () => {
  await pet.load()
  await settings.load()
  await session.refresh()
  await loadGoals()
})

async function loadGoals() {
  const since = Date.now() - 7 * 86_400_000
  const logs = await db.reviewLogs.where('reviewedAt').aboveOrEqual(since).toArray()
  const recentSubmissions = await db.submissions
    .where('createdAt')
    .aboveOrEqual(since)
    .toArray()
  const days = new Set<string>()
  logs.forEach((log) => days.add(studyDayKey(new Date(log.reviewedAt))))
  recentSubmissions.forEach((submission) =>
    days.add(studyDayKey(new Date(submission.createdAt))),
  )
  weeklyDays.value = days.size
  weeklyWritings.value = recentSubmissions.length

  const allSubmissions = await db.submissions.toArray()
  writingDays.value = new Set(
    allSubmissions.map((submission) => studyDayKey(new Date(submission.createdAt))),
  ).size
  const wordbook = await db.wordbook.toArray()
  learnedCount.value = wordbook.filter((row) => row.learned).length
}

async function settle() {
  if (settling.value || !canSettle.value) return
  settling.value = true
  try {
    const result = await pet.settleToday()
    message.value = result.message
  } finally {
    settling.value = false
  }
}

async function feed() {
  const item = await pet.feed()
  message.value = item ? `喂了 ${item.name}，它看起来好多了。` : '没有粮食了，去商店买一袋。'
}

async function interact() {
  const ok = await pet.interact()
  message.value = ok ? '它眯了一下眼睛。' : '今天已经摸过了。'
}

async function claimWeekly() {
  const result = await pet.claimWeekly(weeklyComplete.value)
  message.value = result.message
}

async function claimStage() {
  const result = await pet.claimStage(stageComplete.value)
  message.value = result.message
}

function startRename() {
  if (pet.renameCount <= 0) {
    message.value = '改名卡不足，去商店买一张。'
    return
  }
  nameDraft.value = settings.profile.petName
  renaming.value = true
}

async function confirmRename() {
  const ok = await pet.rename(nameDraft.value)
  message.value = ok ? '名字换好了。' : '改名卡不足。'
  if (ok) renaming.value = false
}
</script>

<style scoped>
.pet-page {
  display: grid;
  gap: 14px;
}

.pet-room {
  position: relative;
  display: grid;
  min-height: 300px;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--room);
}

.room-window {
  position: absolute;
  top: 26px;
  left: 26px;
  width: 104px;
  height: 82px;
  border: 1px solid var(--line);
  border-radius: 10px 10px 4px 4px;
  background: var(--surface);
}

.room-window::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: var(--line);
  content: '';
}

.room-window::after {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: 1px;
  background: var(--line);
  content: '';
}

.pet-center {
  display: grid;
  justify-items: center;
  gap: 0;
  padding-top: 28px;
}

.room-cushion {
  position: absolute;
  bottom: 104px;
  width: 150px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent-soft);
  opacity: 0.65;
}

.stats {
  display: grid;
  gap: 12px;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stat-label {
  color: var(--muted);
  font-size: 12px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.meter-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding-top: 4px;
}

.meter {
  display: grid;
  gap: 5px;
}

.meter-label {
  color: var(--muted);
  font-size: 11px;
}

.meter-value {
  color: var(--ink-2);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.resource-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-top: 4px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 11px;
}

.resource-row strong {
  color: var(--ink);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.status {
  padding: 8px 12px;
  border: 1px solid var(--accent);
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 12px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
}

.actions .btn {
  padding: 0 8px;
  font-size: 12px;
}

.rename-card {
  display: grid;
  gap: 10px;
}

.rename-actions {
  display: flex;
  gap: 8px;
}

.settle-card {
  display: grid;
  gap: 8px;
}

.goals {
  display: grid;
  gap: 10px;
}

.goal-group {
  display: grid;
  gap: 5px;
}

.goal-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.goal-chip {
  padding: 4px 8px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 11px;
  line-height: 1.4;
}

.goal-chip.done {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.goal-line {
  display: grid;
  grid-template-columns: 82px 1fr 52px;
  align-items: center;
  gap: 8px;
  color: var(--ink-2);
  font-size: 11px;
}

.goal-value {
  color: var(--muted);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.award {
  color: var(--accent-strong);
}

.footnote {
  padding: 2px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}
</style>
