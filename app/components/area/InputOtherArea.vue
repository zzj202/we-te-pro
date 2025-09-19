<template>
  <div class="other-bets-container">
    <div class="header">
      <h3 class="title">{{ use === 'bet' ? '其它投注记录' : '其它抛注记录' }}</h3>
      <div class="stats">
        <span class="count">共有 {{ currentList?.length || 0 }} 条</span>
        <span class="total-amount">总金额: {{ calculateTotalAmount() }} 元</span>
      </div>
      <button class="add-btn" @click="openAddDialog">
        <span>+ 增加</span>
      </button>
    </div>

    <div class="bets-list" v-if="currentList?.length">
      <div class="bet-item" v-for="(bet, index) in currentList" :key="index">
        <div class="bet-info">
          <span class="bet-name">{{ bet.inputValue || '未命名' }}</span>
          <span class="bet-amount">{{ bet.totalAmount }} 元</span>
        </div>
        <div class="bet-actions">
          <button class="edit-btn" @click="openEditDialog(index)">编辑</button>
          <button class="delete-btn" @click="deleteBet(index)">删除</button>
        </div>
      </div>
    </div>
    <div class="empty-state" v-else>
      <p>暂无其它记录</p>
    </div>

    <!-- 使用封装后的对话框组件 -->
    <dialog-other-bet-dialog 
      v-model:visible="showDialog" 
      :editing="editingIndex !== null"
      v-model:formData="formData" 
      @confirm="handleConfirm" 
      @cancel="resetForm" 
    />
  </div>
</template>

<script setup>
import { createDiscreteApi } from 'naive-ui'
import { computed, ref } from 'vue'

const { dialog, message } = createDiscreteApi(['dialog', 'message'])

const props = defineProps({
  use: {
    type: String,
    default: 'bet',
    validator: (value) => ['bet', 'pao'].includes(value)
  }
})

const raceStore = useRaceStore()
const currentRace = computed(() => raceStore.getCurrentRace())
const showDialog = ref(false)
const editingIndex = ref(null)
const formData = ref({
  inputValue: '',
  totalAmount: 0
})

// 根据use prop决定使用哪个数组
const currentList = computed(() => {
  return props.use === 'bet' 
    ? currentRace.value?.otherAdd 
    : currentRace.value?.otherPao
})

const calculateTotalAmount = () => {
  if (!currentList.value?.length) return 0
  return currentList.value.reduce((total, bet) => total + Number(bet.totalAmount), 0)
}

const openAddDialog = () => {
  editingIndex.value = null
  resetForm()
  showDialog.value = true
}

const openEditDialog = (index) => {
  editingIndex.value = index
  formData.value = { ...currentList.value[index] }
  showDialog.value = true
}

const deleteBet = (index) => {
  dialog.warning({
    title: '操作提示',
    content: '你确定要删除吗？',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: async () => {
      if (props.use === 'bet') {
        raceStore.removeOtherBet(index)
      } else {
        raceStore.removeOtherPao(index)
      }
      message.success('删除成功')
    },
    onNegativeClick: () => {
      message.info('已取消操作')
    }
  })
}

const handleConfirm = (betData) => {
  if (editingIndex.value === null) {
    // 新增
    if (props.use === 'bet') {
      raceStore.addOtherBet(betData)
    } else {
      raceStore.addOtherPao(betData)
    }
  } else {
    // 编辑
    if (props.use === 'bet') {
      raceStore.updateOtherBet(editingIndex.value, betData)
    } else {
      raceStore.updateOtherPao(editingIndex.value, betData)
    }
  }
  resetForm()
}

const resetForm = () => {
  formData.value = { inputValue: '', totalAmount: 0 }
  editingIndex.value = null
}
</script>

<style scoped>
/* 样式保持不变 */
.other-bets-container {
  margin: 16px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.stats {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

.add-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background-color: #4338ca;
}

.bets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bet-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.bet-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bet-name {
  font-weight: 500;
  color: #333;
}

.bet-amount {
  color: #666;
  font-size: 14px;
}

.bet-actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background-color: #e0e7ff;
  color: #4f46e5;
  border: none;
}

.edit-btn:hover {
  background-color: #c7d2fe;
}

.delete-btn {
  background-color: #fee2e2;
  color: #ef4444;
  border: none;
}

.delete-btn:hover {
  background-color: #fecaca;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: #999;
}
</style>