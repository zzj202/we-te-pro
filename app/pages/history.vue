<template>
    <div class="operation-records-container">
        <div class="records-header">
            <h3 class="records-title">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 16H5V5h2v2h10V5h2v14z"/>
                </svg>
                操作记录
                <span class="records-count" v-if="operationRecords.length > 0">({{ operationRecords.length }})</span>
            </h3>
            <button class="refresh-btn" @click="refreshRecords" title="刷新记录">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
            </button>
        </div>

        <div class="loading-overlay" v-if="loading">
            <div class="loading-spinner"></div>
        </div>

        <div v-if="operationRecords.length === 0" class="empty-records">
            <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V18z"/>
            </svg>
            <p>暂无操作记录</p>
        </div>

        <ul v-else class="records-list">
            <li v-for="record in operationRecords" :key="record.id" class="record-item">
                <div class="record-icon" :class="getRecordTypeClass(record.type)">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path :d="getRecordIcon(record.type)"/>
                    </svg>
                </div>
                <div class="record-content">
                    <div class="record-header">
                        <span class="record-type">{{ getTypeText(record.type) }}</span>
                        <span class="record-time">{{ formatTime(record.timestamp) }}</span>
                    </div>
                    <p class="record-description">{{ record.description }}</p>
                    <div v-if="record.details" class="record-details">
                        {{ record.details }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { createDiscreteApi } from 'naive-ui'


const { message, loadingBar } = createDiscreteApi(['message', 'loadingBar'])
definePageMeta({
    layout: 'race-layouts'
})
// 扩展dayjs插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 设置为中文

const raceStore = useRaceStore()
const operationRecords = ref([])
const loading = ref(false)

onMounted(async () => {
    await loadRecords()
})

const loadRecords = async () => {
    try {
        loading.value = true
        await raceStore.loadFromKvAPI()
        operationRecords.value = raceStore.getCurrentRace().operationRecords || []
        // 按时间倒序排列
        operationRecords.value.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
        console.error('加载操作记录失败:', error)
        message.error('加载操作记录失败')
    } finally {
        loading.value = false
    }
}

const refreshRecords = async () => {
    loadingBar.start()
    try {
        await loadRecords()
        message.success('记录已刷新')
    } catch (error) {
        message.error('刷新失败')
    } finally {
        loadingBar.finish()
    }
}

const formatTime = (timestamp) => {
    const now = dayjs()
    const recordTime = dayjs(timestamp)

    // 如果是今天，显示相对时间（如：5分钟前）
    if (recordTime.isSame(now, 'day')) {
        return recordTime.fromNow()
    }
    // 如果是昨天，显示"昨天 + 时间"
    else if (recordTime.isSame(now.subtract(1, 'day'), 'day')) {
        return `昨天 ${recordTime.format('HH:mm')}`
    }
    // 其他情况显示完整日期时间
    else {
        return recordTime.format('YYYY-MM-DD HH:mm')
    }
}

const getTypeText = (type) => {
    const typeMap = {
        'ADD_BET': '加注',
        'PAO_BET': '抛注',
        'CANCEL_BET': '撤销加注',
        'CANCEL_PAO': '撤销抛注',
        'WIN': '中奖',
        'LOSE': '未中奖',
        'BONUS': '奖金发放'
    }
    return typeMap[type] || type
}

const getRecordTypeClass = (type) => {
    const typeClassMap = {
        'ADD_BET': 'type-add',
        'PAO_BET': 'type-pao',
        'CANCEL_BET': 'type-cancel',
        'CANCEL_PAO': 'type-cancel',
        'WIN': 'type-win',
        'LOSE': 'type-lose',
        'BONUS': 'type-bonus'
    }
    return typeClassMap[type] || 'type-default'
}

const getRecordIcon = (type) => {
    const iconMap = {
        'ADD_BET': 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
        'PAO_BET': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.31-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z',
        'CANCEL_BET': 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
        'CANCEL_PAO': 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-5L12 10.41 8.41 14 7 12.59 10.59 9 7 5.41 8.41 4 12 7.59 15.59 4 17 5.41 13.41 9 17 12.59z',
        'WIN': 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
        'LOSE': 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
        'BONUS': 'M20 8h-3V4H7v4H4v2h3v2H4v2h3v2H4v2h3v4h10v-4h3v-2h-3v-2h3v-2h-3v-2h3V8zM9 6h6v2H9V6zm6 12H9v-2h6v2zm0-4H9v-2h6v2z'
    }
    return iconMap[type] || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.31-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z'
}
</script>

<style scoped lang="scss">
.operation-records-container {
    background-color: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.records-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.records-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    
    .icon {
        width: 20px;
        height: 20px;
        fill: #1890ff;
    }
}

.records-count {
    font-size: 14px;
    color: #666;
    font-weight: normal;
    margin-left: 4px;
}

.refresh-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #f5f5f5;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    .icon {
        width: 16px;
        height: 16px;
        fill: #666;
        transition: transform 0.3s;
    }

    &:hover {
        background-color: #e6f7ff;

        .icon {
            fill: #1890ff;
            transform: rotate(360deg);
        }
    }
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 12px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1890ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.empty-records {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    padding: 40px 0;

    .empty-icon {
        width: 48px;
        height: 48px;
        fill: #d9d9d9;
        opacity: 0.6;
        margin-bottom: 16px;
    }

    p {
        margin: 0;
        font-size: 14px;
    }
}

.records-list {
    flex: 1;
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    max-height: calc(100vh - 200px);
}

.record-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: rgba(24, 144, 255, 0.03);
    }
}

.record-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex-shrink: 0;

    .icon {
        width: 18px;
        height: 18px;
        fill: white;
    }

    &.type-add {
        background: linear-gradient(135deg, #52c41a, #73d13d);
    }

    &.type-pao {
        background: linear-gradient(135deg, #fa8c16, #ffa940);
    }

    &.type-cancel {
        background: linear-gradient(135deg, #f5222d, #ff4d4f);
    }

    &.type-win {
        background: linear-gradient(135deg, #13c2c2, #36cfc9);
    }

    &.type-lose {
        background: linear-gradient(135deg, #722ed1, #9254de);
    }

    &.type-bonus {
        background: linear-gradient(135deg, #fadb14, #ffec3d);
    }

    &.type-default {
        background: linear-gradient(135deg, #1890ff, #40a9ff);
    }
}

.record-content {
    flex: 1;
    min-width: 0;
}

.record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.record-type {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.record-time {
    font-size: 12px;
    color: #999;
}

.record-description {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    word-break: break-word;
}

.record-details {
    margin-top: 6px;
    padding: 6px 8px;
    background-color: #f6f6f6;
    border-radius: 4px;
    font-size: 13px;
    color: #666;
}

@media (max-width: 768px) {
    .operation-records-container {
        padding: 12px;
    }

    .record-item {
        padding: 10px 0;
    }

    .record-icon {
        width: 32px;
        height: 32px;
        
        .icon {
            width: 16px;
            height: 16px;
        }
    }
}

@media (max-width: 480px) {
    .records-title {
        font-size: 15px;
    }

    .record-description {
        font-size: 13px;
    }

    .record-details {
        font-size: 12px;
    }
}
</style>