<template>
  <AppShell>
    <div class="page shop">
      <header class="page-head">
        <div>
          <p class="eyebrow">shop</p>
          <h1 class="h1">商店</h1>
        </div>
        <span class="coin-badge">{{ pet.state.coins }} 金币</span>
      </header>

      <p class="lede">
        食物喂饱它，皮肤和装饰只改外观。阶段奖励会自动解锁，不用买。
      </p>

      <p v-if="status" class="status">{{ status }}</p>

      <section v-for="group in groups" :key="group.type" class="shop-section">
        <div class="spread">
          <h2 class="h3">{{ shopTypeLabels[group.type] }}</h2>
          <span class="caption">{{ group.items.length }} 件</span>
        </div>
        <div class="shop-grid">
          <article v-for="item in group.items" :key="item.id" class="shop-card">
            <div class="shop-card-head">
              <h3 class="shop-name">{{ item.name }}</h3>
              <span v-if="isOwned(item)" class="tag tag-accent">已拥有</span>
              <span v-else-if="item.unlockStage" class="tag">阶段解锁</span>
            </div>
            <p class="shop-desc">{{ item.description }}</p>
            <div class="shop-foot">
              <span class="price">{{ item.price > 0 ? `${item.price} 金币` : '免费' }}</span>
              <span v-if="countOf(item) > 0" class="caption">×{{ countOf(item) }}</span>
              <button
                v-if="item.type === 'skin' && isOwned(item)"
                class="btn btn-sm"
                type="button"
                :disabled="pet.state.equippedSkin === item.id"
                @click="equip(item)"
              >
                {{ pet.state.equippedSkin === item.id ? '已装备' : '使用' }}
              </button>
              <button
                v-else-if="item.type === 'skin' || item.type === 'decor'"
                class="btn btn-sm"
                type="button"
                :disabled="!canBuy(item)"
                @click="buy(item)"
              >
                {{ item.unlockStage ? '阶段解锁' : '购买' }}
              </button>
              <button
                v-else
                class="btn btn-sm"
                type="button"
                :disabled="!canBuy(item)"
                @click="buy(item)"
              >
                购买
              </button>
            </div>
          </article>
        </div>
      </section>

      <RouterLink to="/pet" class="btn btn-ghost btn-block">回宠物房间</RouterLink>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import {
  shopItems,
  shopTypeLabels,
  type ShopItem,
  type ShopItemType,
} from '@/data/shop'
import { stageRank } from '@/domain/pet'
import { usePetStore } from '@/stores/pet'

const pet = usePetStore()
const status = ref('')

const groups = computed(() => {
  const order: ShopItemType[] = ['food', 'skin', 'decor', 'toy', 'rename']
  return order
    .map((type) => ({
      type,
      items: shopItems.filter((item) => item.type === type),
    }))
    .filter((group) => group.items.length > 0)
})

onMounted(async () => {
  await pet.load()
})

function isOwned(item: ShopItem) {
  if (item.type === 'skin' || item.type === 'decor') {
    return pet.state.owned.includes(item.id)
  }
  return (pet.state.inventory[item.id] ?? 0) > 0
}

function countOf(item: ShopItem) {
  return pet.state.inventory[item.id] ?? 0
}

function canBuy(item: ShopItem) {
  if (item.unlockStage) return false
  if (item.type === 'skin' || item.type === 'decor') {
    return !pet.state.owned.includes(item.id) && pet.state.coins >= item.price
  }
  return pet.state.coins >= item.price
}

async function buy(item: ShopItem) {
  const result = await pet.buy(item.id)
  status.value = result.message
}

async function equip(item: ShopItem) {
  const ok = await pet.equipSkin(item.id)
  status.value = ok ? `已换上 ${item.name}。` : '还没有这件皮肤。'
}
</script>

<style scoped>
.shop {
  display: grid;
  gap: 16px;
}

.coin-badge {
  padding: 5px 10px;
  border: 1px solid var(--accent);
  border-radius: 8px;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.lede {
  color: var(--ink-2);
  font-size: 13px;
  line-height: 1.6;
}

.status {
  padding: 8px 12px;
  border: 1px solid var(--accent);
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 12px;
}

.shop-section {
  display: grid;
  gap: 8px;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.shop-card {
  display: grid;
  align-content: start;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
}

.shop-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
}

.shop-name {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

.shop-desc {
  min-height: 38px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.shop-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.price {
  color: var(--ink-2);
  font-size: 11px;
  font-weight: 600;
}

.shop-foot .btn {
  margin-left: auto;
}

@media (max-width: 380px) {
  .shop-grid {
    grid-template-columns: 1fr;
  }
}
</style>
