<template>
    <!-- 类型选择模态框 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>{{ modalTitle }}</h3>
                <button class="modal-close" @click="closeModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div v-if="hasRecordToday" class="alert-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="#856404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>今日已有开奖记录，请勿重复添加！</span>
                </div>
                <div v-else>
                    <div class="input-section">
                        <label class="input-label">开奖号码</label>
                        <input-quick-te-ping-input ref="quickInputRef" v-model:flat-codes="newFlatCodes"
                            v-model:special-code="newSpecialCode" />
                    </div>
                    <div class="action-buttons">
                        <button class="cancel-btn" @click="closeModal">取消</button>
                        <button class="confirm-btn" @click="handleConfirm">确认添加</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PrizeCategory } from '~/types/race.types'
import dayjs from 'dayjs';
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(
    ['message']
)
// 新平码
const newFlatCodes = ref<string[]>([])
// 新特码
const newSpecialCode = ref('')
// 快速输入
const quickInputRef = ref()

const emit = defineEmits(['confirm', 'close'])

// 模态框状态
const showModal = ref(false)
const currentCategory = ref<PrizeCategory | null>(null)
const today = dayjs().format('YYYY年MM月DD日')// 获取今日日期 YYYY-MM-DD

// 计算属性：今日是否有记录
const hasRecordToday = computed(() => {
    if (!currentCategory.value) return false
    return currentCategory.value.prizes.some(prize => prize.date === today)
})

// 计算属性：模态框标题
const modalTitle = computed(() => {
    if (!currentCategory.value) return '添加记录'
    return hasRecordToday.value
        ? '今日已有记录'
        : `${currentCategory.value.name}-第 ${currentCategory.value.prizes.length + 1} 期`
})

// 打开类型选择模态框
const openDialog = (category: PrizeCategory) => {
    currentCategory.value = category
    newFlatCodes.value = []
    newSpecialCode.value = ''
    showModal.value = true
}

// 关闭所有模态框
const closeModal = () => {
    showModal.value = false
    currentCategory.value = null
    emit('close')
}

// 确认添加
const handleConfirm = () => {
    if (!newFlatCodes.value.length) {
        message.error(`未输入开奖号码`)
        return
    }
    if (!quickInputRef.value.check()) {
        return
    }
    emit('confirm', [...newFlatCodes.value, newSpecialCode.value])
    closeModal()
}

// 暴露方法给父组件
defineExpose({
    openDialog: openDialog,
})
</script>

<style scoped>
/* 模态框样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
    transition: all 0.3s ease;
}

.modal-content {
    background-color: white;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(0);
    opacity: 1;
    transition: all 0.3s ease;
    border: 1px solid #eaeaea;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    background-color: #f9f9f9;
    border-radius: 16px 16px 0 0;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.modal-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-close:hover {
    background-color: #f0f0f0;
    color: #333;
}

.modal-close svg {
    width: 20px;
    height: 20px;
}

.modal-body {
    padding: 24px;
}

.alert-message {
    padding: 16px;
    background-color: #fff3cd;
    color: #856404;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 500;
}

.alert-message svg {
    flex-shrink: 0;
}

.input-section {
    margin-bottom: 24px;
}

.input-label {
    display: block;
    margin-bottom: 12px;
    font-size: 15px;
    font-weight: 500;
    color: #333;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}

.cancel-btn,
.confirm-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-btn {
    background-color: #f5f5f5;
    color: #666;
    border: 1px solid #e0e0e0;
}

.cancel-btn:hover {
    background-color: #eaeaea;
}

.confirm-btn {
    background-color: #4f46e5;
    color: white;
    border: none;
}

.confirm-btn:hover {
    background-color: #4338ca;
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
    }

    .modal-header {
        padding: 16px;
    }

    .modal-body {
        padding: 16px;
    }

    .action-buttons {
        flex-direction: column;
        gap: 8px;
    }

    .cancel-btn,
    .confirm-btn {
        width: 100%;
        padding: 12px;
    }
}
</style>