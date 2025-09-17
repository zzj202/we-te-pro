<template>
    <div class="result-container">
        <div class="numbers-display">
            <div class="section-header">
                <div class="section-title">
                    <span class="title-icon">🎯</span>
                    <h3>选号</h3>
                </div>
                <div class="section-badge">
                    <span class="badge-count">{{ selectedNumbers.length }}</span>
                    <span>个</span>
                </div>
            </div>
            <div class="balls-container">
                <template v-if="selectedNumbers.length > 0">
                    <span v-for="(num, index) in selectedNumbers" :key="index" class="lottery-ball" :class="getBallColorClass(num)">
                        {{ num }}
                    </span>
                </template>
                <div v-else class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>暂无选号</p>
                </div>
            </div>
        </div>

        <div class="amount-display">
            <div class="section-header">
                <div class="section-title">
                    <span class="title-icon">💰</span>
                    <h3>信息</h3>
                </div>
            </div>

            <div class="amount-grid">
                <div class="amount-item">
                    <span class="amount-label">单注</span>
                    <span class="amount-value">{{ amount }} </span>
                </div>
                <div class="amount-item total">
                    <span class="amount-label">总额</span>
                    <span class="amount-value total-value">{{ totalAmount }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { LOTTERY_NUMBER_CATEGORIES } from '~/constants/race.constants';

const props = defineProps({
    selectedNumbers: {
        type: Array,
        default: () => []
    },
    amount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    }
})

// 根据号码获取对应的颜色类
const getBallColorClass = (num) => {
    // 将数字格式化为两位数字符串
    const formattedNum = num.toString().padStart(2, '0');
    if (LOTTERY_NUMBER_CATEGORIES['红波'].includes(formattedNum)) {
        return 'ball-red';
    } else if (LOTTERY_NUMBER_CATEGORIES['蓝波'].includes(formattedNum)) {
        return 'ball-blue';
    } else if (LOTTERY_NUMBER_CATEGORIES['绿波'].includes(formattedNum)) {
        return 'ball-green';
    }
    return 'ball-default'; // 默认颜色，以防万一
}
</script>

<style scoped>
.result-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
    margin-bottom: 2px;
}

.numbers-display,
.amount-display {
    background: white;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-title h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
}

.title-icon {
    font-size: 18px;
}

.section-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #64748b;
}

.badge-count {
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 600;
    color: #3b82f6;
}

.balls-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-height: 40px;
}

.lottery-ball {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: white;
    border-radius: 50%;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.ball-red {
    background: linear-gradient(135deg, #e21919, #e60b03);
}

.ball-blue {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
}

.ball-green {
    background: linear-gradient(135deg, #10b981, #22c55e);
}

.ball-default {
    background: linear-gradient(135deg, #94a3b8, #64748b);
}

.lottery-ball:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1px 0;
    color: #94a3b8;
}

.empty-state p {
    margin-top: 8px;
    font-size: 14px;
}

.amount-grid {
    display: grid;
    gap: 12px;
}

.amount-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.amount-item.total {
    border-top: 1px dashed #e2e8f0;
    padding-top: 12px;
}

.amount-label {
    font-size: 14px;
    color: #64748b;
}

.amount-value {
    font-weight: 600;
    color: #04af04;
}

.total-value {
    color: #f30202;
    font-size: 16px;
}

@media (max-width: 768px) {
    .result-container {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .lottery-ball {
        width: 32px;
        height: 32px;
        font-size: 13px;
    }
}

@media (max-width: 480px) {
    .numbers-display,
    .amount-display {
        padding: 5px;
    }

    .section-title h3 {
        font-size: 15px;
    }

    .amount-label {
        font-size: 13px;
    }

    .amount-value {
        font-size: 14px;
    }

    .total-value {
        font-size: 15px;
    }
}
</style>