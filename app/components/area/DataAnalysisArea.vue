<template>
  <div class="data-analysis-area">
    <h3 class="section-title">历史数据分析</h3>
    
    <!-- 热门号码分析 -->
    <div class="analysis-section">
      <h4 class="subsection-title">热门号码分析</h4>
      <div class="hot-numbers">
        <div class="hot-number-item" v-for="(number, index) in hotNumbers" :key="index">
          <span class="number">{{ number.number }}</span>
          <span class="count">出现 {{ number.count }} 次</span>
        </div>
      </div>
    </div>
    
    <!-- 冷门号码分析 -->
    <div class="analysis-section">
      <h4 class="subsection-title">冷门号码分析</h4>
      <div class="cold-numbers">
        <div class="cold-number-item" v-for="(number, index) in coldNumbers" :key="index">
          <span class="number">{{ number.number }}</span>
          <span class="count">出现 {{ number.count }} 次</span>
        </div>
      </div>
    </div>
    
    <!-- 近期趋势 -->
    <div class="analysis-section">
      <h4 class="subsection-title">近期趋势</h4>
      <div class="trend-analysis">
        <div class="trend-item" v-for="(trend, index) in trends" :key="index">
          <span class="trend-label">{{ trend.label }}</span>
          <span class="trend-value">{{ trend.value }}</span>
        </div>
      </div>
    </div>
    
    <!-- 号码分布 -->
    <div class="analysis-section">
      <h4 class="subsection-title">号码分布</h4>
      <div class="number-distribution">
        <div class="distribution-row" v-for="(row, index) in numberDistribution" :key="index">
          <span class="range">{{ row.range }}</span>
          <span class="count">出现 {{ row.count }} 次</span>
          <div class="bar-container">
            <div class="bar" :style="{ width: row.percentage + '%' }"></div>
          </div>
          <span class="percentage">{{ row.percentage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

// 计算号码出现频率
const numberFrequency = computed(() => {
  const frequency = {}
  
  props.data.forEach(prize => {
    prize.numbers.forEach(number => {
      if (frequency[number]) {
        frequency[number]++
      } else {
        frequency[number] = 1
      }
    })
  })
  
  return frequency
})

// 热门号码（出现次数最多的5个）
const hotNumbers = computed(() => {
  const numbers = Object.entries(numberFrequency.value)
    .map(([number, count]) => ({ number, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  
  return numbers
})

// 冷门号码（出现次数最少的5个）
const coldNumbers = computed(() => {
  const numbers = Object.entries(numberFrequency.value)
    .map(([number, count]) => ({ number, count }))
    .sort((a, b) => a.count - b.count)
    .slice(0, 5)
  
  return numbers
})

// 近期趋势分析
const trends = computed(() => {
  const last5Results = props.data.slice(0, 5)
  
  // 计算平均数字
  const totalNumbers = last5Results.reduce((sum, prize) => {
    return sum + prize.numbers.reduce((s, num) => s + parseInt(num), 0)
  }, 0)
  const averageNumber = Math.round(totalNumbers / (last5Results.length * 7))
  
  // 计算奇偶比
  let oddCount = 0
  let evenCount = 0
  last5Results.forEach(prize => {
    prize.numbers.forEach(num => {
      if (parseInt(num) % 2 === 0) {
        evenCount++
      } else {
        oddCount++
      }
    })
  })
  const oddEvenRatio = `${Math.round((oddCount / (oddCount + evenCount)) * 100)}% 奇 / ${Math.round((evenCount / (oddCount + evenCount)) * 100)}% 偶`
  
  // 计算大小比（以25为分界线）
  let smallCount = 0
  let bigCount = 0
  last5Results.forEach(prize => {
    prize.numbers.forEach(num => {
      if (parseInt(num) <= 25) {
        smallCount++
      } else {
        bigCount++
      }
    })
  })
  const sizeRatio = `${Math.round((smallCount / (smallCount + bigCount)) * 100)}% 小 / ${Math.round((bigCount / (smallCount + bigCount)) * 100)}% 大`
  
  return [
    { label: '平均数字', value: averageNumber },
    { label: '奇偶比例', value: oddEvenRatio },
    { label: '大小比例', value: sizeRatio },
    { label: '最近5期出现次数', value: last5Results.length * 7 }
  ]
})

// 号码分布（按数字范围分组）
const numberDistribution = computed(() => {
  const ranges = [
    { range: '1-10', min: 1, max: 10 },
    { range: '11-20', min: 11, max: 20 },
    { range: '21-30', min: 21, max: 30 },
    { range: '31-40', min: 31, max: 40 },
    { range: '41-49', min: 41, max: 49 }
  ]
  
  const totalNumbers = props.data.length * 7
  
  return ranges.map(range => {
    let count = 0
    props.data.forEach(prize => {
      prize.numbers.forEach(num => {
        const number = parseInt(num)
        if (number >= range.min && number <= range.max) {
          count++
        }
      })
    })
    
    const percentage = Math.round((count / totalNumbers) * 100)
    
    return {
      range: range.range,
      count,
      percentage
    }
  })
})
</script>

<style scoped lang="scss">
.data-analysis-area {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.analysis-section {
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.subsection-title {
  font-size: 16px;
  font-weight: 500;
  color: #444;
  margin-bottom: 12px;
}

.hot-numbers, .cold-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hot-number-item, .cold-number-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  min-width: 60px;
  
  .number {
    font-size: 18px;
    font-weight: 600;
  }
  
  .count {
    font-size: 12px;
    color: #666;
  }
}

.hot-number-item {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  
  .number {
    color: #f5222d;
  }
}

.cold-number-item {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  
  .number {
    color: #52c41a;
  }
}

.trend-analysis {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f0f5ff;
  border-radius: 6px;
  
  .trend-label {
    font-size: 14px;
    color: #444;
  }
  
  .trend-value {
    font-size: 14px;
    font-weight: 600;
    color: #1890ff;
  }
}

.number-distribution {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-row {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .range {
    width: 50px;
    font-size: 14px;
    color: #444;
  }
  
  .count {
    width: 80px;
    font-size: 14px;
    color: #666;
  }
  
  .bar-container {
    flex: 1;
    height: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .bar {
    height: 100%;
    background-color: #1890ff;
    transition: width 0.3s ease;
  }
  
  .percentage {
    width: 50px;
    text-align: right;
    font-size: 14px;
    color: #1890ff;
    font-weight: 500;
  }
}

@media (max-width: 768px) {
  .trend-analysis {
    grid-template-columns: 1fr;
  }
  
  .hot-numbers, .cold-numbers {
    justify-content: space-between;
  }
  
  .distribution-row {
    flex-wrap: wrap;
    
    .bar-container {
      order: 1;
      width: 100%;
      margin-top: 4px;
    }
  }
}
</style>