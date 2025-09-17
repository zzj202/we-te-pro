<template>
    <!-- 修改名称模态框 -->
    <div v-if="showRaceEdit" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h3>修改场次名称</h3>
                <button class="modal-close" @click="closeModal">
                    &times;
                </button>
            </div>
            <div class="modal-body">
                <div class="name-edit-form">
                    <label for="session-name">新名称:</label>
                    <input id="session-name" type="text" v-model="newName" placeholder="请输入新的场次名称"
                        @keyup.enter="saveName" />
                </div>
                <div class="name-edit-form">
                    <label for="session-name">中奖号码:</label>
                    <input-quick-te-ping-input ref="quickInputRef" v-model:flat-codes="newFlatCodes"
                        v-model:special-code="newSpecialCode" />
                    <div class="form-actions">
                        <button class="cancel-btn" @click="closeModal">取消</button>
                        <button class="save-btn" @click="saveName">保存</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import type { Race } from '@/types/race.types'
import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(
    ['message']
)
const emit = defineEmits(['save', 'close'])

// 模态框状态
const showRaceEdit = ref(false)

const newRace = ref()
// 新名称
const newName = ref('')
//新平码
const newFlatCodes = ref<string[]>([])
//新特码
const newSpecialCode = ref('')
//快速输入
const quickInputRef = ref()


// 打开名称编辑模态框
const openEdit = (race: Race) => {
    newName.value = race.name
    newFlatCodes.value = race.flatCodes
    newSpecialCode.value = race.specialCode

    newRace.value = race
    showRaceEdit.value = true
}

// 保存名称
//直接穿透修改
const saveName = () => {
    if (!newName.value.trim()) {
        message.error(`未输入`)
        return
    }
    if (!quickInputRef.value.check()) {
        return
    }

    newRace.value.name = newName.value.trim()
    newRace.value.flatCodes = newFlatCodes.value
    newRace.value.specialCode = newSpecialCode.value.trim()
    showRaceEdit.value = false
    message.success(`修改成功`)
}

// 关闭模态框
const closeModal = () => {
    showRaceEdit.value = false
    emit('close')
}

// 暴露方法给父组件
defineExpose({
    openEdit: openEdit,
})
</script>

<style scoped>
/* 复用原有的模态框基础样式 */
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
    max-width: 500px;
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

/* 名称编辑表单样式 */
.name-edit-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.name-edit-form label {
    font-weight: 500;
    color: #333;
}

.name-edit-form input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.name-edit-form input:focus {
    border-color: #4f46e5;
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
}

.cancel-btn,
.save-btn {
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.cancel-btn {
    background-color: #f3f4f6;
    color: #4b5563;
    border: 1px solid #e5e7eb;
}

.cancel-btn:hover {
    background-color: #e5e7eb;
}

.save-btn {
    background-color: #4f46e5;
    color: white;
    border: none;
}

.save-btn:hover {
    background-color: #4338ca;
}

@media (max-width: 480px) {
    .modal-content {
        width: 95%;
    }

    .form-actions {
        justify-content: space-between;
    }

    .cancel-btn,
    .save-btn {
        flex: 1;
    }
}
</style>