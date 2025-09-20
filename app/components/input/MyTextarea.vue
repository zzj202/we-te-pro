<template>
    <div class="textarea-wrapper" :class="{ 'is-focused': isFocused }">
        <textarea 
            ref="textareaRef" 
            v-model="modelValue" 
            @input="handleInput"
            @focus="isFocused = true"
            @blur="isFocused = false"
            :style="{
                height: `${lineHeight * visibleLines}px`,
                'white-space': 'nowrap'
            }"
            placeholder="输入内容..."
        ></textarea>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'input'])

const textareaRef = ref(null)
const isFocused = ref(false)
const lineHeight = 30 // 行高
const visibleLines = 21 // 可见行数

const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const handleInput = () => {
    emit('input')
}

onMounted(() => {
    if (textareaRef.value) {
        textareaRef.value.style.height = `${lineHeight * visibleLines}px`
        textareaRef.value.style.whiteSpace = 'nowrap'
    }
})
</script>

<style scoped>
.textarea-wrapper {
    width: 100%;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    background: white;
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;
}

.textarea-wrapper.is-focused {
    border-color: #4d90fe;
    box-shadow: 0 0 0 2px rgba(77, 144, 254, 0.2);
}

textarea {
    height: 100%;
    padding: 16px;
    border: none;
    resize: none;
    font-family: 'Fira Code', 'Consolas', 'Courier New', monospace;
    line-height: v-bind(lineHeight + 'px');
    overflow: auto;
    white-space: nowrap;
    width: 100%;
    font-size: 15px;
    color: #333;
    background: white;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s ease;
}

textarea::placeholder {
    color: #aaa;
    font-style: italic;
}

textarea:focus {
    background-color: #fafafa;
}

/* 自定义滚动条样式 */
textarea::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

textarea::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 6px;
}

textarea::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 6px;
    border: 2px solid #f5f5f5;
}

textarea::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* 平滑滚动 */
textarea {
    scroll-behavior: smooth;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .textarea-wrapper {
        border-radius: 8px;
    }
    
    textarea {
        padding: 12px;
        font-size: 14px;
    }
}
</style>