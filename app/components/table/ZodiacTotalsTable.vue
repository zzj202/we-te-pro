<template>
  <div class="zodiac-totals-section">
    <div class="zodiac-totals-grid">
      <div v-for="item in sortedZodiacTotals" :key="item.name" class="zodiac-total-card"
        :style="{ backgroundColor: getZodiacColor(item.name) }">
        <div class="zodiac-total-name">{{ item.name }}</div>
        <div class="zodiac-total-amount">{{ formatAmount(item.total) }}</div>
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
  }
})

// 计算每个生肖的总金额
const zodiacTotals = computed(() => {
  const totals = {}
  // 初始化所有生肖的总金额为0
  for (const zodiac in ZODIAC_NUMBER_MAP) {
    totals[zodiac] = 0
  }
  // 遍历每个号码，累加到对应生肖
  props.numbers.forEach(item => {
    for (const [zodiac, numbers] of Object.entries(ZODIAC_NUMBER_MAP)) {
      if (numbers.includes(item.number)) {
        totals[zodiac] += item.amount
        break // 找到对应生肖后跳出循环
      }
    }
  })
  return totals
})
// 按生肖金额排序后的数据，用于展示
const sortedZodiacTotals = computed(() => {
  return Object.entries(zodiacTotals.value)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
})

// 格式化金额显示
const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN')
}

const getZodiacColor = (zodiac) => {
  const colors = {
    // '鼠': '#F4D03F',  // 更柔和的金色，象征财富但不刺眼
    // '牛': '#5D8C7B',  // 沉稳的苔绿色，体现牛的稳重可靠
    // '虎': '#E74C3C',  // 深红色调，展现虎的威严和力量
    // '兔': '#E08283',  // 柔和的粉红色，体现兔的温顺可爱
    // '龙': '#3498DB',  // 明亮的皇家蓝，彰显龙的尊贵
    // '蛇': '#27AE60',  // 翡翠绿，表现蛇的神秘与智慧
    // '马': '#E67E22',  // 活力的橙红色，展现马的奔放热情
    // '羊': '#F9E79F',  // 温暖的奶油黄，体现羊的温顺柔和
    // '猴': '#F39C12',  // 活泼的橙色，表现猴的机灵好动
    // '鸡': '#F1C40F',  // 明亮的金黄色，象征鸡的华丽羽毛
    // '狗': '#BDC3C7',  // 中性的银灰色，体现狗的忠诚可靠
    // '猪': '#F48FB1'   // 柔和的粉红色，象征猪的福气和喜庆
  };
  return colors[zodiac] || '#ECF0F1'; // 更柔和的默认灰色
};
</script>

<style scoped>
.zodiac-totals-section {
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.zodiac-totals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.zodiac-total-card {
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333;
}

.zodiac-total-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.zodiac-total-name {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
  color: #1e293b;
}

.zodiac-total-amount {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 3px;
  color: #334155;
}

@media (max-width: 768px) {
  .zodiac-totals-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}

@media (max-width: 480px) {
  .zodiac-totals-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .zodiac-total-card {
    padding: 8px;
  }

  .zodiac-total-name {
    font-size: 13px;
  }

  .zodiac-total-amount {
    font-size: 16px;
  }
}
</style>