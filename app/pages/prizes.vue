<template>
    <div class="game-sessions-container">
        <div class="header">
            <div class="header-content">
                <h2 class="header-title">当前场次：{{ activeCategory.name }}</h2>
                <p class="header-subtitle">所有游戏场次信息</p>
            </div>
            <button class="btn-create" @click="prizeDialog.openDialog(activeCategory)">
                <i class="icon-add">+</i> 添加新记录
            </button>
        </div>
        <dialog-prize-create-dialog ref="prizeDialog" @confirm="handleConfirmAdd"></dialog-prize-create-dialog>
        <!-- 种类选择按钮 -->
        <div class="category-tabs">
            <button v-for="session in prizeStore.allPrizeCategories" :key="session.id" class="tab-button"
                :class="{ 'active': activeCategory.id === session.id }" @click="setActiveGameSession(session.id)">
                {{ session.name }}
                <span v-if="session.prizes.length > 0" class="badge">{{ session.prizes.length }}</span>
            </button>
        </div>
        <!-- 场次数据展示 -->
        <div class="races-container" v-if="activeCategory.prizes.length > 0">
            <div class="races-header">
                <h3>开奖记录</h3>
                <span class="total-count">共 {{ activeCategory.prizes.length }} 条记录</span>
            </div>
            <div class="races-list">
                <item-prize-card-item v-for="(prize, index) in activeCategory.prizes" :prize="prize" :index="index"
                    :totalCount="activeCategory.prizes.length" @view="handleView" @edit="handleEdit"
                    @delete="handleDelete" />
            </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-races" v-else>
            <div class="empty-content">
                <span class="empty-icon">📊</span>
                <p>暂无开奖记录</p>
                <button class="btn-add-race" @click="prizeDialog.openDialog(activeCategory)">
                    <i class="icon-add">+</i> 添加开奖记录
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { createDiscreteApi } from 'naive-ui'
import dayjs from 'dayjs';
const { message } = createDiscreteApi(
    ['message']
)

definePageMeta({
    layout: 'race-layouts'
})

const prizeStore = usePrizeStore()
const prizeDialog = ref(null)
const activeCategory = ref(prizeStore.getCurrentCategory() || {
    id: '',
    name: '',
    prizes: []
})

const handleConfirmAdd = (numbers) => {
    prizeStore.addPrize(activeCategory.value.id, {
        id: Date.now().toString(),
        date: dayjs().format('YYYY年MM月DD日'),
        numbers: numbers
    })
}
//处理查看
const handleView = (prize) => {
    console.log(prize)
};

// 处理编辑场次
const handleEdit = () => {
    message.warning(`暂不支持编辑`)
};


// 处理删除场次
const handleDelete = (prize) => {
    console.log(prize.date)
    if (prize.date === dayjs().format('YYYY年MM月DD日')) {
        prizeStore.removePrize(activeCategory.value.id, prize.id)
        message.success(`删除成功`)
    } else {
        message.error(`不可删除今天以前的记录`)
    }
};

// 设置当前选中的场次
const setActiveGameSession = (sessionId) => {
    const session = prizeStore.allPrizeCategories.find(s => s.id === sessionId)
    if (session) {
        activeCategory.value = session
    }
}
</script>

<style scoped>
/* Your existing styles remain unchanged */
.game-sessions-container {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eaeaea;
}

.header-content {
    flex: 1;
}

.header-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: #333;
}

.header-subtitle {
    font-size: 14px;
    color: #666;
    margin: 4px 0 0;
}

.btn-create {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #4f46e5;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.btn-create:hover {
    background-color: #4338ca;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(79, 70, 229, 0.3);
}

.icon-add {
    font-weight: bold;
    font-size: 16px;
}

/* 种类标签样式 */
.category-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 5px;
}

.tab-button {
    position: relative;
    background: #f5f5f5;
    border: none;
    border-radius: 8px;
    padding: 20px 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #555;
    white-space: nowrap;
    transition: all 0.2s ease;
}

.tab-button:hover {
    background: #e0e0e0;
}

.tab-button.active {
    background: #4f46e5;
    color: white;
}

.tab-button .badge {
    position: absolute;
    top: -2px;
    right: 2px;
    background: #ff4757;
    color: white;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}

.tab-button.active .badge {
    background: white;
    color: #4f46e5;
}

/* 场次列表容器 */
.races-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 20px;
}

.races-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.races-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.total-count {
    font-size: 14px;
    color: #666;
    background: #f5f5f5;
    padding: 4px 10px;
    border-radius: 12px;
}

/* 场次卡片样式 */
.races-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

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
}

.race-name {
    font-weight: 600;
    color: #333;
    font-size: 16px;
    margin-right: 10px;
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

.race-details {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 15px;
}

.detail-item {
    display: flex;
    align-items: center;
}

.detail-label {
    color: #888;
    font-size: 13px;
    margin-right: 8px;
    min-width: 60px;
}

.detail-value {
    font-size: 13px;
    color: #555;
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.ball {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #4f46e5;
    color: white;
    font-size: 12px;
    font-weight: bold;
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

/* 空状态样式 */
.empty-races {
    text-align: center;
    padding: 40px 20px;
    border: 1px dashed #ddd;
    border-radius: 10px;
    background: #fafafa;
}

.empty-content {
    max-width: 300px;
    margin: 0 auto;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 15px;
    display: block;
}

.empty-races p {
    color: #888;
    margin-bottom: 20px;
}

.btn-add-race {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #4f46e5;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.btn-add-race:hover {
    background: #4338ca;
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .btn-create {
        width: 100%;
        justify-content: center;
    }

    .category-tabs {
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 10px;
    }

    .race-details {
        grid-template-columns: 1fr;
    }

    .race-actions {
        justify-content: flex-start;
    }
}
</style>