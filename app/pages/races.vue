<template>
    <div class="game-sessions-container">
        <div class="header">
            <div class="header-content">
                <h2 class="header-title">当前场次：
                    <!-- {{ raceStore.getCurrentRace().name }} -->
                </h2>
                <p class="header-subtitle">所有游戏场次信息</p>
            </div>
            <button class="btn-create" @click="raceCreateDialog.openTypeSelection()">
                <i class="icon-add">+</i> 创建新场次
            </button>
        </div>
        <!-- 使用封装的模态框组件 -->
        <dialog-race-create-dialog ref="raceCreateDialog" @create="handleCreate" @close="handleCloseModal" />
        <dialog-race-edit-dialog ref="raceEditDialog"></dialog-race-edit-dialog>
        <!-- 种类选择按钮 -->
        <div class="category-tabs">
            <button v-for="category in raceStore.allRaceCategories" :key="category.id" class="tab-button"
                :class="{ 'active': activeCategoryId === category.id }" @click="setActiveCategory(category.id)">
                {{ category.name }}
                <span class="badge">{{ category.races.length }}</span>
            </button>
        </div>
        <!-- 当前选中种类的场次列表 -->
        <div class="races-container" v-if="activeCategory">
            <div class="races-header">
                <h3>{{ activeCategory.name }} 场次列表</h3>
                <span class="total-count">共 {{ activeCategory.races.length }} 场次</span>
            </div>
            <div v-if="activeCategory.races.length > 0" class="races-list">
                <item-race-card-item v-for="race in activeCategory.races" :key="race.id" :race="race"
                    @view="handleViewRace" @edit="handleEditRace" @delete="handleDeleteRace" />
            </div>

            <div v-else class="empty-races">
                <div class="empty-content">
                    <i class="empty-icon">📋</i>
                    <p>暂无场次数据</p>
                    <button class="btn-add-race" @click="raceCreateDialog.openTypeSelection()">
                        <i class="icon-add">+</i> 添加场次
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'race-layouts'
})

const raceStore = useRaceStore()
const prizeStore = usePrizeStore()
const raceCreateDialog = ref(null)
const raceEditDialog = ref(null)
const activeCategoryId = ref(raceStore.getCurrentCategory().id || null)
const router = useRouter()

// 处理查看场次
const handleViewRace = (raceId) => {
    raceStore.setCurrentCategoryId(activeCategoryId.value)
    raceStore.setCurrentRaceId(raceId)
    prizeStore.setCurrentCategoryId(raceStore.currentCategoryId)
    // console.log(raceStore.getCurrentCategory())
    // console.log(raceStore.getCurrentRace())
    router.push(`/show?raceId=${raceId}`)

};

// 处理编辑场次
const handleEditRace = (raceId) => {
    console.log('编辑场次:', raceId);
    raceEditDialog.value.openEdit(raceStore.getRaceByCategoryIdRaceId(activeCategoryId.value, raceId))

};


// 处理删除场次
const handleDeleteRace = (raceId) => {
    console.log('删除场次:', raceId);
    // 实际业务逻辑...
};


// 获取当前选中的分类
const activeCategory = computed(() => {
    return raceStore.allRaceCategories.find(c => c.id === activeCategoryId.value)
})

// 设置当前选中的分类
const setActiveCategory = (categoryId) => {
    activeCategoryId.value = categoryId
}

// 处理创建场次
const handleCreate = (data) => {
    const category = raceStore.addRace(data.name)
    setActiveCategory(category.id)
}

// 处理模态框关闭
const handleCloseModal = () => {
    console.log('模态框已关闭')
}
</script>

<style scoped>
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
    padding: 15px 20px;
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
    top: 2px;
    right: 2px;
    background: #ff4757;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
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