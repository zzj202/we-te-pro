<template>
  <div class="zodiac-grid">
    <div v-for="item in sortedNumbers" :key="item.number" class="zodiac-card" :class="[getAmountClass(item.amount)]">
      <div class="zodiac-header">
        <span class="zodiac-number">{{ item.number }}</span>
        <span class="zodiac-name">{{ getZodiac(item.number) }}</span>
      </div>
      <div v-if="item.amount" class="zodiac-content">
        <div class="amount-row">
          <span class="value">{{ formatAmount(item.amount) }}</span>
        </div>
      </div>
      <div v-if="paoShow" class="zodiac-content">
        <div class="amount-row">
          <span class="pao-value">{{ formatAmount(item.amount - item.paoAmount) }}</span>
        </div>
      </div>
      <div v-if="lastShow" class="last-appear" :class="getLastAppearClass(item.number)">
        {{ getLastAppearText(item.number) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ZODIAC_NUMBER_MAP } from '~/constants/race.constants'

const props = defineProps({
  numbers: {
    type: Array,
    required: true
  },
  paoShow: {
    type: Boolean,
    default: false
  },
  lastShow: {
    type: Boolean,
    default: false
  },
  numberLastAppearMap: {
    type: Object,
    default: () => ({})
  }
})

const sortedNumbers = computed(() => {
  return [...props.numbers].sort((a, b) => b.amount - a.amount)
})

const getZodiac = (number) => {
  const numStr = number.toString().padStart(2, '0')
  for (const [zodiac, numbers] of Object.entries(ZODIAC_NUMBER_MAP)) {
    if (numbers.includes(numStr)) return zodiac
  }
  return '未知'
}

// 格式化金额显示
const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN')
}

// 根据金额获取样式类
const getAmountClass = (amount) => {
  if (amount >= 1500) return 'amount-high'
  if (amount >= 1000) return 'amount-medium-high'
  if (amount >= 500) return 'amount-medium'
  return 'amount-default'
}

// 获取最后出现次数的文本
const getLastAppearText = (number) => {
  const numStr = number.toString().padStart(2, '0')
  const appearCount = props.numberLastAppearMap[numStr] || 0
  return appearCount === 0 ? '新' : `${appearCount}期`
}

// 根据最后出现次数获取样式类
const getLastAppearClass = (number) => {
  const numStr = number.toString().padStart(2, '0')
  const appearCount = props.numberLastAppearMap[numStr] || 0
  if (appearCount === 1) return 'last-appear-new'
  if (appearCount <= 2) return 'last-appear-recent'
  if (appearCount <= 10) return 'last-appear-medium'
  return 'last-appear-long'
}
</script>

<style scoped>
.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 12px;
}

.zodiac-card {
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
  position: relative;
  overflow: hidden;
}

.zodiac-card:hover {
  transform: translateY(-2px);
}

.zodiac-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f0f0f0;
}

.zodiac-number {
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.zodiac-name {
  font-size: 15px;
  color: #666;
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
}

.zodiac-content {
  display: flex;
  flex-direction: column;
}

.amount-row {
  display: flex;
  justify-content: center;
}

.value {
  font-weight: 600;
  font-size: 16px;
}

.pao-value {
  color: #ffffff;
  background-color: rgb(9, 199, 9);
  border-radius: 5px;
  padding: 5px;
  font-size: 16px;
  font-weight: 800;
}

.last-appear {
  /* position: absolute;
  top: 14px;
  right: 7px; */
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
  color: white;
}

.last-appear-new {
  background-color: #ef4444;
  /* 红色表示新出现 */
}

.last-appear-recent {
  background-color: #08a36f;
  /* 绿色表示近期出现 */
}

.last-appear-medium {
  background-color: #63626291;

  /* 橙色表示中等时间未出现 */
}

.last-appear-long {
  background-color: rgba(156, 156, 156, 0.548);
  /* 灰色表示长时间未出现 */
}

/* 金额颜色分类和大小变化 */
.amount-default .value {
  color: #6b7280;
  font-size: 16px;
}

.amount-medium .value {
  color: #d97706;
  font-size: 18px;
}

.amount-medium-high .value {
  color: #dc2626;
  font-size: 20px;
}

.amount-high .value {
  color: #7c2d12;
  font-size: 22px;
}

@media (max-width: 768px) {
  .zodiac-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, fr));
    gap: 10px;
  }

  .zodiac-card {
    padding: 10px;
  }

  /* 响应式调整字体大小 */
  .amount-default .value {
    font-size: 14px;
  }

  .amount-medium .value {
    font-size: 16px;
  }

  .amount-medium-high .value {
    font-size: 18px;
  }

  .amount-high .value {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .zodiac-grid {
    grid-template-columns: repeat(auto-fill, minmax(55px, 1fr));
    gap: 2px;
  }

  .zodiac-number {
    font-size: 13px;
  }

  .zodiac-name {
    font-size: 11px;
  }

  .last-appear {
    font-size: 10px;
    padding: 1px 4px;
  }

  /* 响应式调整字体大小 */
  .amount-default .value {
    font-size: 12px;
  }

  .amount-medium .value {
    font-size: 14px;
  }

  .amount-medium-high .value {
    font-size: 16px;
  }

  .amount-high .value {
    font-size: 18px;
  }
}
</style>