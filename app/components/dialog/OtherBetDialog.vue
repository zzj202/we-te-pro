<!-- src/components/BetDialog.vue -->
<template>
  <div class="dialog-overlay" v-if="visible">
    <div class="dialog-content">
      <h3>{{ editing ? '编辑' : '添加' }}</h3>
      <div class="form-group">
        <label>名称</label>
        <input type="text" v-model="formData.inputValue" placeholder="请输入名称" @keyup.enter="confirm">
      </div>
      <div class="form-group">
        <label>金额(元)</label>
        <input type="number" v-model="formData.totalAmount" placeholder="请输入金额" @keyup.enter="confirm">
      </div>
      <div class="dialog-actions">
        <button class="cancel-btn" @click="cancel">取消</button>
        <button class="confirm-btn" @click="confirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createDiscreteApi } from 'naive-ui'
const { dialog, message } = createDiscreteApi(['dialog', 'message'])

const props = defineProps({
  visible: Boolean,
  editing: Boolean,
  formData: {
    type: Object,
    default: () => ({ inputValue: '', totalAmount: 0 })
  }
})

const emit = defineEmits(['update:visible', 'update:formData', 'confirm', 'cancel'])

const localFormData = ref({ ...props.formData })

watch(() => props.formData, (newVal) => {
  localFormData.value = { ...newVal }
}, { deep: true })

const confirm = () => {
  if (!localFormData.value.inputValue || !localFormData.value.totalAmount) {
    message.warning('请填写完整信息')
    return
  }
  dialog.success({
    title: '操作提示',
    content: `确定操作？`,
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      emit('confirm', { ...localFormData.value })
      emit('update:visible', false)
    },
    onNegativeClick: () => {
      message.warning('取消')
    }
  })

}

const cancel = () => {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.dialog-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
  width: 90%;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn,
.confirm-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  background-color: #f3f4f6;
  color: #666;
  border: none;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
}

.confirm-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
}

.confirm-btn:hover {
  background-color: #4338ca;
}
</style>