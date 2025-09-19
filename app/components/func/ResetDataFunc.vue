<template>
    <div class="data-control-container">
        <div class="action-buttons">
            <button class="btn btn-clear" @click="click">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                </svg>
                清空场次记录
            </button>
            <button class="btn btn-export" @click="exportData">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                </svg>
                导出场次记录
            </button>
            <button class="btn btn-import" @click="triggerFileInput">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M5,20H19V18H5M19,9H15V15H9V9H5L12,2L19,9Z" />
                </svg>
                导入场次记录
            </button>
            <input type="file" ref="fileInput" @change="handleFileImport" accept=".json" class="file-input" />
        </div>

        <div class="data-preview" v-if="exportedData">
            <div class="preview-header">
                <h3>数据预览</h3>
                <button class="copy-btn" >
                    <svg class="icon" viewBox="0 0 24 24">
                        <path
                            d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                    </svg>
                    复制
                </button>
            </div>
            <pre>{{ exportedData }}</pre>
        </div>
    </div>
</template>

<script setup>
import { DEFAULT_RACE_CATEGORYS } from '~/constants/race.constants'
import { createDiscreteApi } from 'naive-ui'

const { dialog, message, loadingBar } = createDiscreteApi(
    ['dialog', 'message', 'loadingBar']
)


const raceStore = useRaceStore()
const exportedData = ref(null)
const fileInput = ref(null) // 文件输入元素的引用

const click = () => {
    dialog.warning({
        title: '操作提示',
        content: '你确定要清空所有场次记录吗？',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        onPositiveClick: async () => {
            raceStore.raceCategories = DEFAULT_RACE_CATEGORYS
            raceStore.saveTokvAPI()
        },
        onNegativeClick: () => {
            message.info('已取消操作')
        }
    })

}

const exportData = () => {
    dialog.info({
        title: '操作提示',
        content: '你确定要导出所有场次记录吗？',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        onPositiveClick: async () => {
            exportedData.value = JSON.stringify(raceStore.raceCategories, null, 2)
            downloadJsonFile(raceStore.raceCategories, '场次记录_race_categories.json')
        },
        onNegativeClick: () => {
            message.info('已取消操作')
        }
    })

}

// 触发文件选择对话框
const triggerFileInput = () => {
    fileInput.value.click()
}

// 处理文件导入
const handleFileImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result)

            // 验证数据格式（可选）
            if (!Array.isArray(jsonData)) {
                throw new Error('导入的数据格式不正确，必须是数组格式')
            }
            // 更新 store 数据
            raceStore.raceCategories = jsonData
            raceStore.saveTokvAPI()

            alert('数据导入成功！')
            exportedData.value = JSON.stringify(jsonData, null, 2) // 显示导入的数据

        } catch (error) {
            console.error('导入失败:', error)
            alert(`导入失败: ${error.message}`)
        }
    }
    reader.readAsText(file)
}

const downloadJsonFile = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}
</script>

<style>
.data-control-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
}

.action-buttons {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.btn {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn:active {
    transform: translateY(0);
}

.icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    fill: currentColor;
}

.btn-clear {
    background-color: #ff6b6b;
    color: white;
}

.btn-export {
    background-color: #4ecdc4;
    color: white;
}

.btn-import {
    background-color: #74b9ff;
    color: white;
}

.file-input {
    display: none;
}

.data-preview {
    background-color: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.preview-header h3 {
    margin: 0;
    color: #343a40;
    font-size: 16px;
    font-weight: 600;
}

.copy-btn {
    padding: 6px 12px;
    background-color: #495057;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.copy-btn:hover {
    background-color: #6c757d;
}

pre {
    margin: 0;
    padding: 12px;
    background-color: #2d3436;
    color: #f8f9fa;
    border-radius: 6px;
    max-height: 300px;
    overflow-y: auto;
    font-family: 'Courier New', Courier, monospace;
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
}

/* 响应式设计 */
@media (max-width: 600px) {
    .action-buttons {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }

    .data-control-container {
        padding: 15px;
    }
}
</style>