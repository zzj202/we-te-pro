<template>
    <div class="lottery-control-panel">
        <div class="button-group">
            <button class="control-btn clear-btn" @click="clear">
                <i class="icon-clear"></i> 清空开奖数据
            </button>
            <button class="control-btn export-btn" @click="exportData">
                <i class="icon-export"></i> 导出开奖数据
            </button>
            <button class="control-btn import-btn" @click="triggerFileInput">
                <i class="icon-import"></i> 导入开奖数据
            </button>
            <input type="file" ref="fileInput" @change="handleFileImport" accept=".json" style="display: none" />
        </div>

        <div class="data-preview" v-if="exportedData">
            <h3>数据预览</h3>
            <pre>{{ exportedData }}</pre>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue'
import { DEFAULT_PRIZE_CATEGORYS } from '~/constants/race.constants'

import { createDiscreteApi } from 'naive-ui'

const { dialog, message, loadingBar } = createDiscreteApi(
    ['dialog', 'message', 'loadingBar']
)

const prizeStore = usePrizeStore()
const exportedData = ref(null)
const fileInput = ref(null) // 文件输入元素的引用

const clear = () => {
    dialog.warning({
        title: '操作提示',
        content: '你确定要清空所有开奖记录吗？',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        onPositiveClick: async () => {
            prizeStore.prizeCategories = DEFAULT_PRIZE_CATEGORYS
            prizeStore.saveTokvAPI()
        },
        onNegativeClick: () => {
            message.info('已取消操作')
        }
    })
}
const exportData = () => {
    dialog.info({
        title: '操作提示',
        content: '你确定要导出开奖记录吗？',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        onPositiveClick: async () => {
            exportedData.value = JSON.stringify(prizeStore.prizeCategories, null, 2)
            downloadJsonFile(prizeStore.prizeCategories, `开奖数据_prize_categories.json`)
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
            prizeStore.prizeCategories = jsonData
            prizeStore.saveTokvAPI()

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


<style scoped>
.lottery-control-panel {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.button-group {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.control-btn {
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
}

.control-btn i {
    margin-right: 8px;
    font-size: 16px;
}

.clear-btn {
    background-color: #ff4d4f;
    color: white;
}

.clear-btn:hover {
    background-color: #ff7875;
}

.export-btn {
    background-color: #1890ff;
    color: white;
}

.export-btn:hover {
    background-color: #40a9ff;
}

.import-btn {
    background-color: #52c41a;
    color: white;
}

.import-btn:hover {
    background-color: #73d13d;
}

.data-preview {
    background-color: white;
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
}

.data-preview h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #333;
    font-size: 16px;
}

.data-preview pre {
    margin: 0;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
    max-height: 300px;
    overflow-y: auto;
    font-family: 'Courier New', Courier, monospace;
    font-size: 13px;
    line-height: 1.5;
}

/* 图标样式 - 可以使用字体图标库如Font Awesome或自定义图标 */
.icon-clear:before {
    content: "🗑️";
}

.icon-export:before {
    content: "📤";
}

.icon-import:before {
    content: "📥";
}
</style>