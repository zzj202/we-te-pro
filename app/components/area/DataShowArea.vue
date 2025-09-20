<template>
  <div class="betting-container" v-if="currentRace">
    <!-- 操作按钮 -->
    <div class="content-area">
      <div class="action-buttons">
        <button class="btn btn-pao" @click="togglePaoShow">
          <i :class="['icon-pao', paoShow ? 'active' : '']"></i>
          {{ paoShow ? '隐藏剩抛' : '显示剩抛' }}
        </button>
        <button class="btn btn-history" @click="toggleLastShow">
          <i :class="['icon-history', lastShow ? 'active' : '']"></i>
          {{ lastShow ? '隐藏往期' : '显示往期' }}
        </button>
        <button class="btn btn-refresh" @click="loadData">
          <i class="icon-refresh"></i>
          刷新
        </button>
      </div>
    </div>
    <!-- 金额信息栏 -->
    <div class="stats-bar">
      <div class="amount-container">
        <div class="total-amount">
          <span class="amount-label">特码金额：</span>
          <span class="amount-value">{{ formatAmount(currentRace.addTotalAmount) }}</span>
        </div>
        <div class="remaining-amount">
          <span class="amount-label">剩余特码金额：</span>
          <span class="amount-value">{{ formatAmount(currentRace.addTotalAmount - currentRace.paoTotalAmount)
          }}</span>
        </div>
        <!-- <div class="total-amount">
          <span class="amount-label"> 平码金额:</span>
          <span class="amount-value"> {{ formatAmount(otherTotalAmount) }}</span>
        </div>
        <div class="remaining-amount">
          <span class="amount-label"> 剩余平码金额:</span>
          <span class="amount-value"> {{ formatAmount(otherTotalAmount - otherTotalAmountPao) }}</span>
        </div> -->
      </div>
    </div>
    <!-- 主要内容区域 -->
    <div class="content-area">
      <table-zodiac-numbers-table :numberLastAppearMap="numberLastAppearMap" :numbers="dataNumbers" :pao-show="paoShow"
        :lastShow="lastShow" />
      <table-zodiac-totals-table :numbers="dataNumbers" />
    </div>
    <!-- 走势图 -->
    <div class="content-area">
      <area-line-chart-area :lotteryData="prizes"></area-line-chart-area>
    </div>
    <!-- 柱状图 -->
    <div class="content-area">
      <area-bar-chart-area :frequencyData="prizeStore.getNumberFrequency()"></area-bar-chart-area>
    </div>
  </div>
  <div v-else>
    暂无
  </div>
</template>

<script setup>
import { createDiscreteApi } from 'naive-ui'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 初始化dayjs插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { message } = createDiscreteApi(['message'])
const raceStore = useRaceStore()
const prizeStore = usePrizeStore()
const paoShow = ref(false)
const lastShow = ref(false)
const numberLastAppearMap = ref()

const currentRace = computed(() => {
  return raceStore.getCurrentRace()
})
const dataNumbers = computed(() => {
  return currentRace.value.numbers || []
})
const prizes = computed(() => {
  return prizeStore.getCurrentCategory()?.prizes || []
})
const otherTotalAmount = computed(() => {
  if (!currentRace.value?.otherAdd?.length) return 0
  return currentRace.value.otherAdd.reduce((sum, bet) => sum + Number(bet.totalAmount), 0)
})
const otherTotalAmountPao = computed(() => {
  if (!currentRace.value?.otherAdd?.length) return 0
  return currentRace.value.otherPao.reduce((sum, bet) => sum + Number(bet.totalAmount), 0)
})
// 切换剩抛显示状态
const togglePaoShow = () => {
  paoShow.value = !paoShow.value
}

// 切换往期显示状态
const toggleLastShow = () => {
  lastShow.value = !lastShow.value
}

onMounted(() => {
  numberLastAppearMap.value = prizeStore.getNumberLastAppearBycategoryId()
})

// 加载数据
const loadData = async () => {
  const oldState = currentRace.value
  try {
    await raceStore.loadFromKvAPI()
    const newState = currentRace.value
    if (oldState.addTotalAmount === newState.addTotalAmount) {
      message.warning('当前数据金额未发生更改', { duration: 1000 })
    } else {
      const diff = newState.addTotalAmount - oldState.addTotalAmount
      console.log(newState)
      const diffText = diff > 0 ? `增加 ${formatAmount(diff)}` : `减少 ${formatAmount(Math.abs(diff))}`
      message.success(`刷新成功~金额由 ${formatAmount(oldState.addTotalAmount)} ➡️ ${formatAmount(newState.addTotalAmount)}，${diffText}`, {
        duration: 8000
      })
      message.success(`最后修改时间: ${dayjs(newState.updatedAt).format('YYYY-MM-DD HH:mm:ss')} (${dayjs(newState.updatedAt).fromNow()})`, {
        duration: 5000
      })
    }
  } catch (error) {
    message.error('刷新数据失败', { duration: 2000 })
    console.error('加载数据失败:', error)
  }
}

// 格式化金额显示
const formatAmount = (amount) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<style scoped lang="scss">
.betting-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  max-width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stats-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: white;
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}


.amount-container {
  display: flex;
  gap: 18px;
}

.amount-label {
  font-size: 16px;
  color: #666;
  margin-right: 8px;
}

.amount-value {
  font-size: 18px;
  font-weight: bold;
}

.total-amount .amount-value {
  color: red;
  /* 红色表示总金额 */
}

.remaining-amount .amount-value {
  color: green;
  /* 绿色表示剩余金额 */
}

.action-buttons {
  display: flex;
  justify-content: end;
  gap: 12px;
  margin: auto 0;

  .btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    i {
      display: inline-block;
      width: 16px;
      height: 16px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .btn-pao {
    background-color: #fa8c16;
    color: white;

    .icon-pao {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.31-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>');

      &.active {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
      }
    }
  }

  .btn-history {
    background-color: #722ed1;
    color: white;

    .icon-history {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>');

      &.active {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
      }
    }
  }

  .btn-refresh {
    background-color: #13c2c2;
    color: white;

    .icon-refresh {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>');
    }
  }
}

.content-area {
  background-color: white;
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin: 5px 0;
}

@media (max-width: 768px) {
  .stats-bar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .action-buttons {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 576px) {
  .betting-container {
    padding: 12px;
  }

  .stats-bar {
    padding: 10px 12px;
  }

  .action-buttons {
    flex-wrap: wrap;
    justify-content: flex-end;

    .btn {
      padding: 6px 10px;
      font-size: 13px;
    }
  }

  .amount-label {
    font-size: 14px;
  }

  .amount-value {
    font-size: 16px;
  }
}
</style>