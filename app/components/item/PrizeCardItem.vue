<template>
  <div class="race-card">
    <div class="race-main">
      <div class="race-title">
        <span class="race-name">{{ prize.date }}</span>
        <span class="race-id">第 {{ totalCount - index }} 期</span>
      </div>
      <span class="race-status" :class="statusClass">{{ statusText }}</span>
    </div>

    <div class="race-details">
      <div class="detail-item numbers-row">
        <span class="detail-label">开奖号码：</span>
        <div class="numbers-container">
      <span 
            class="ball" 
            :class="{ 'special-ball': i === prize.numbers.length - 1 }" 
            v-for="(num, i) in prize.numbers" 
            :key="i"
          >
            {{ num }}
          </span>
        </div>
      </div>
    </div>

    <div class="race-actions">
      <button class="action-btn view" @click="$emit('view', prize)">查看</button>
      <button class="action-btn edit" @click="$emit('edit')">编辑</button>
      <button class="action-btn delete" @click="$emit('delete', prize)">删除</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  prize: {
    type: Object,
    required: true,
    default: () => ({
      date: '',
      numbers: [],
      status: 'active' // 可以是 'active', 'pending', 'canceled' 等
    })
  },
  index: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'delete'])

const statusText = computed(() => {
  switch (props.prize.status) {
    case 'active':
      return '已开奖'
    case 'pending':
      return '待开奖'
    case 'canceled':
      return '已取消'
    default:
      return '未知状态'
  }
})

const statusClass = computed(() => {
  switch (props.prize.status) {
    case 'active':
      return 'active'
    case 'pending':
      return 'pending'
    case 'canceled':
      return 'canceled'
    default:
      return ''
  }
})
</script>

<style scoped>
.race-card {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s ease;
}

.race-card:hover {
  border-color: #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.race-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.race-title {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.race-name {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.race-id {
  font-size: 12px;
  color: #888;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.race-status {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
  background: #f0f0f0;
  color: #888;
}

.race-status.active {
  background: #e6f7ee;
  color: #28a745;
}

.race-status.pending {
  background: #fef3c7;
  color: #f59e0b;
}

.race-status.canceled {
  background: #fee2e2;
  color: #ef4444;
}

.race-details {
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-item.numbers-row {
  align-items: flex-start;
}

.detail-label {
  color: #888;
  font-size: 13px;
  margin-right: 8px;
  min-width: 60px;
  white-space: nowrap;
}

.numbers-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.ball {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4f46e5; /* 默认颜色 */
  color: white;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.special-ball {
  background: #ff00c8; /* 最后一个球的特殊颜色 */
}

.race-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.view {
  background: #e0f2fe;
  color: #0ea5e9;
}

.action-btn.view:hover {
  background: #bae6fd;
}

.action-btn.edit {
  background: #e0e7ff;
  color: #4f46e5;
}

.action-btn.edit:hover {
  background: #c7d2fe;
}

.action-btn.delete {
  background: #fee2e2;
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fecaca;
}

@media (max-width: 768px) {
  .race-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .race-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .race-status {
    align-self: flex-start;
  }

  .race-actions {
    justify-content: flex-start;
  }

  .detail-item.numbers-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .detail-label {
    margin-right: 0;
  }
}
</style>