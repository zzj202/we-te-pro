<template>
    <div>
        <button @click="clear">清空开奖数据</button>
        <button @click="exportData">导出开奖数据</button>
        <button @click="triggerFileInput">导入开奖数据</button>
        <input type="file" ref="fileInput" @change="handleFileImport" accept=".json" style="display: none" />
        <pre v-if="exportedData">{{ exportedData }}</pre>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { DEFAULT_PRIZE_CATEGORYS } from '~/constants/race.constants'
const prizeStore = usePrizeStore()
const exportedData = ref(null)
const fileInput = ref(null) // 文件输入元素的引用

const clear = () => {
    prizeStore.prizeCategories = DEFAULT_PRIZE_CATEGORYS
    prizeStore.saveTokvAPI()
}
const exportData = () => {
    exportedData.value = JSON.stringify(prizeStore.prizeCategories, null, 2)
    downloadJsonFile(prizeStore.prizeCategories, 'prize_categories.json')
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