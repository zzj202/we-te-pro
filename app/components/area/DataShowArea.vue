<template>
  <div class="betting-container" v-if="currentRace">
    <!-- 顶部统计信息栏 -->
    <div class="stats-bar">
      <div class="amount-display">
        <div class="total-amount">
          <span class="amount-label">总金额:</span>
          <span class="amount-value">{{ formatAmount(currentRace.addTotalAmount) }}</span>
        </div>
        <div v-if="currentRace.addTotalAmount" class="remaining-amount">
          <span class="amount-label">剩余金额:</span>
          <span class="amount-value">{{ formatAmount(currentRace.addTotalAmount -
            currentRace.paoTotalAmount) }}</span>
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn btn-pao" @click="paoShow = !paoShow">
          <i :class="['icon-pao', paoShow ? 'active' : '']"></i>
          {{ paoShow ? '隐藏剩抛' : '显示剩抛' }}
        </button>
        <button class="btn btn-refresh" @click="loadData">
          <i class="icon-refresh"></i>
          刷新
        </button>
      </div>
    </div>
    <!-- 主要内容区域 -->
    <div class="content-area">
      <table-zodiac-totals-table :numbers="data" />
      <table-zodiac-numbers-table :numbers="data" :pao-show="paoShow" />
    </div>
  </div>
  <div v-else>
    未展示
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
const paoShow = ref(false)
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})
const currentRace =computed(() => {
  return raceStore.getCurrentRace()
})


// 加载数据
const loadData = async () => {
  const oldState = currentRace
  try {
    await raceStore.loadFromKvAPI()
    const newState = currentRace
    if (oldState.totalAmount === newState.totalAmount) {
      message.warning('当前数据金额未发生更改', { duration: 1000 })
    } else {
      const diff = newState.totalAmount - oldState.totalAmount
      const diffText = diff > 0 ? `增加 ${formatAmount(diff)}` : `减少 ${formatAmount(Math.abs(diff))}`
      message.success(`刷新成功~金额由 ${formatAmount(oldState.totalAmount)} ➡️ ${formatAmount(newState.totalAmount)}，${diffText}`, {
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
  padding: 16px;
  max-width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.amount-display {
  display: flex;
  align-items: center;
  gap: 24px;

  .total-amount,
  .remaining-amount {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .amount-label {
    font-size: 16px;
    color: #666;
    font-weight: 500;
  }

  .amount-value {
    font-size: 18px;
    font-weight: 600;

    .total-amount & {
      color: #1890ff;
    }

    .remaining-amount & {
      color: #52c41a;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;

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

  .btn-column {
    background-color: #409eff;
    color: white;

    .icon-column {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M3 5v14h18V5H3zm16 2v10H5V7h14zM7 9v6h2V9H7zm4 0v6h2V9h-2zm4 0v6h2V9h-2z"/></svg>');
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
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .stats-bar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .amount-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
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
    justify-content: flex-start;

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