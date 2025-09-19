<template>
  <header class="topbar">
    <div class="left-section">
      <button class="toggle-sidebar" @click="$emit('toggle-sidebar')" aria-label="切换菜单">
        <svg class="menu-icon" viewBox="0 0 24 24" width="20" height="20">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor" />
        </svg>
      </button>
      <h1 class="page-title">{{ title }}</h1>
      <div class="race-info">
        <div class="category">
          {{ raceStore.currentCategoryId ? raceStore.getCurrentCategory().name : '' }}
        </div>

        <div class="race-name">
          {{ currentRace ? currentRace.name : '' }}
        </div>

        <div class="total-amount">
          特码总金额：{{ formatAmount(currentRace ? currentRace.addTotalAmount : 0) }}
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="action-buttons">
        <button class="action-btn" @click="refreshPage" title="刷新页面">
          <svg class="action-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    default: '仪表盘'
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-sidebar'])
const raceStore = useRaceStore()
const currentRace = computed(() => {
  return raceStore.getCurrentRace()
})
const otherTotalAmount = computed(() => {
  if (!currentRace.value?.otherAdd?.length) return 0
  return currentRace.value.otherAdd.reduce((sum, bet) => sum + Number(bet.totalAmount), 0)
})
// 格式化金额显示
const formatAmount = (amount) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0
  }).format(amount)
}
const refreshPage = () => {
  window.location.reload()
}
</script>

<style scoped lang="scss">
.topbar {
  --topbar-height: 50px;
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
  --text-color: #1e293b;
  --secondary-text: #64748b;
  --border-color: #e2e8f0;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --radius: 8px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: var(--topbar-height);
  background-color: white;
  box-shadow: var(--shadow);
  z-index: 50;
  position: sticky;
  top: 0;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.toggle-sidebar {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(99, 102, 241, 0.1);

    .menu-icon {
      color: var(--primary-color);
    }
  }
}

.menu-icon {
  color: var(--text-color);
  transition: var(--transition);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}


.right-section {
  display: flex;

  align-items: center;
  gap: 16px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: auto;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(99, 102, 241, 0.1);

    .action-icon {
      color: var(--primary-color);
    }
  }
}

.action-icon {
  color: var(--text-color);
  transition: var(--transition);
}

.refresh-btn:hover .refresh-icon {
  transform: rotate(180deg);
}

.race-info {
  display: flex;
  text-align: center;
  align-items: center;
  font-family: Arial, sans-serif;
  border-radius: 5px;

}

.category {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding-right: 10px;
}

.race-name {
  font-size: 16px;
  color: #555;
  padding-right: 10px;
}

.total-amount {
  font-size: 18px;
  color: #ad03d8;
  font-weight: bold;
}

@media (max-width: 768px) {
  .topbar {
    padding: 0 16px;
    --topbar-height: 56px;
  }

  .left-section {
    gap: 12px;
  }

  .page-title {
    font-size: 16px;
  }

  .action-buttons {
    gap: 8px;
  }
}
</style>