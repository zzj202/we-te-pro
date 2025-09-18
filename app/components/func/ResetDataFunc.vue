<template>
    <div>
        <button @click="click">重置分类场次</button>
        <button @click="exportData">导出数据</button>
        <button @click="triggerFileInput">导入数据</button>
        <input type="file" ref="fileInput" @change="handleFileImport" accept=".json" style="display: none" />
        <pre v-if="exportedData">{{ exportedData }}</pre>
    </div>
</template>

<script setup>
import { DEFAULT_RACE_CATEGORYS } from '~/constants/race.constants'
import { ref } from 'vue'

const raceStore = useRaceStore()
const exportedData = ref(null)
const fileInput = ref(null) // 文件输入元素的引用

const click = () => {
    raceStore.raceCategories = DEFAULT_RACE_CATEGORYS
    raceStore.saveTokvAPI() // 
}

const exportData = () => {
    exportedData.value = JSON.stringify(raceStore.raceCategories, null, 2)
    downloadJsonFile(raceStore.raceCategories, 'race_categories.json')
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