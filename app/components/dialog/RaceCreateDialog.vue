<template>
    <!-- 类型选择模态框 -->
    <div v-if="showTypeSelection" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h3>选择场次类型</h3>
                <button class="modal-close" @click="closeModal">
                    &times;
                </button>
            </div>
            <div class="modal-body">
                <div class="type-grid">
                    <div v-for="type in sessionTypes" :key="type.id" class="type-card" @click="selectType(type)">
                        <div class="type-icon">
                            {{ type.icon }}
                        </div>
                        <h4>{{ type.name }}</h4>
                        <p>{{ type.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    // 可以接收外部传入的场次类型
    types: {
        type: Array,
        default: () => [
            {
                name: '澳门',
                icon: '🎰',
                description: '澳门特色场次'
            },
            {
                name: '澳大利亚',
                icon: '🦘',
                description: '澳大利亚特色场次'
            },
            {
                name: '午夜',
                icon: '🌙',
                description: '午夜特别场次'
            },
            {
                name: '十二点半',
                icon: '⏰',
                description: '12:30场次'
            }
        ]
    }
})

const emit = defineEmits(['create', 'close'])

// 使用props中的types或默认值
const sessionTypes = ref(props.types)

// 模态框状态
const showTypeSelection = ref(false)

// 选中的类型
const selectedType = ref(null)

// 打开类型选择模态框
const openTypeSelection = () => {
    showTypeSelection.value = true
}

// 选择类型
const selectType = (type) => {
    selectedType.value = type
    showTypeSelection.value = false
    emit('create', selectedType.value)
}

// 关闭所有模态框
const closeModal = () => {
    showTypeSelection.value = false
    emit('close')
}

// 暴露方法给父组件
defineExpose({
    openTypeSelection,
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
}

.modal-content {
    background-color: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eaeaea;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
}

.modal-body {
    padding: 20px;
}

/* 类型选择网格 */
.type-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
}

.type-card {
    padding: 16px;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.type-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #4f46e5;
}

.type-icon {
    font-size: 32px;
    margin-bottom: 12px;
}

.type-card h4 {
    margin: 8px 0;
    color: #333;
}

.type-card p {
    margin: 0;
    font-size: 14px;
    color: #666;
}

@media (max-width: 768px) {
    .type-grid {
        grid-template-columns: 1fr 1fr;
    }

    .modal-content {
        width: 95%;
    }
}

@media (max-width: 480px) {
    .type-grid {
        grid-template-columns: 1fr;
    }
}
</style>