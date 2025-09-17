<template>
    <div class="textarea-wrapper">
        <div class="textarea-container">
            <div class="line-numbers" ref="lineNumbersRef">
                <span v-for="n in totalLines + 2" :key="n" :class="{
                    'visible-line': isLineVisible(n),
                    'current-line': isCurrentLine(n)
                }">
                    {{ n }}
                </span>
            </div>
            <textarea ref="textareaRef" v-model="modelValue" @input="handleInput" @scroll="syncScroll"
                @click="updateCurrentLine" :style="{
                    height: `${lineHeight * (visibleLines + 2)}px`,
                    'white-space': 'nowrap'
                }"></textarea>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'input'])

const textareaRef = ref(null)
const lineNumbersRef = ref(null)
const lineHeight = 26 // 增大行高，提高可读性
const visibleLines = 20 // 减少默认可见行数，更紧凑
const scrollPosition = ref({ top: 0, left: 0 })
const currentLine = ref(1) // 跟踪当前行

const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const totalLines = computed(() => {
    return Math.max(modelValue.value.split('\n').length, 1)
})

const isLineVisible = (lineNumber) => {
    const startLine = Math.floor(scrollPosition.value.top / lineHeight) + 1
    const endLine = startLine + visibleLines - 1
    return lineNumber >= startLine && lineNumber <= endLine
}

const isCurrentLine = (lineNumber) => {
    return lineNumber === currentLine.value
}

const updateCurrentLine = () => {
    if (textareaRef.value) {
        const cursorPosition = textareaRef.value.selectionStart
        const textBeforeCursor = modelValue.value.substring(0, cursorPosition)
        currentLine.value = textBeforeCursor.split('\n').length
    }
}

const handleInput = () => {
    updateCurrentLine()
    emit('input')
}

const syncScroll = () => {
    if (textareaRef.value) {
        scrollPosition.value = {
            top: textareaRef.value.scrollTop,
            left: textareaRef.value.scrollLeft
        }
        if (lineNumbersRef.value) {
            lineNumbersRef.value.scrollTop = textareaRef.value.scrollTop
        }
    }
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
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: white;
}

.textarea-container {
    display: flex;
    position: relative;
    font-family: 'Fira Code', 'Consolas', 'Courier New', monospace;
    line-height: v-bind(lineHeight + 'px');
    min-width: fit-content;
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

.line-numbers {
    padding: 12px 8px 12px 12px;
    background-color: #f8f9fa;
    border-right: 1px solid #e9ecef;
    text-align: right;
    user-select: none;
    overflow: hidden;
    height: v-bind(lineHeight * visibleLines + 'px');
    display: flex;
    flex-direction: column;
    min-width: 36px;
    position: sticky;
    left: 0;
    z-index: 1;
    transition: background-color 0.2s;
}

.line-numbers:hover {
    background-color: #f1f3f5;
}

.line-numbers span {
    color: #868e96;
    height: v-bind(lineHeight + 'px');
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
    opacity: 0.6;
    transition: all 0.2s ease;
    font-size: 14px;
    white-space: nowrap;
}

.line-numbers span.visible-line {
    opacity: 0.9;
}

.line-numbers span.current-line {
    opacity: 1;
    color: #4263eb;
    font-weight: 600;
    background-color: #edf2ff;
    border-radius: 4px;
}

textarea {
    height: 100%;
    padding: 12px;
    border: none;
    resize: none;
    font-family: inherit;
    line-height: inherit;
    overflow: auto;
    white-space: nowrap;
    width: 100%;
    font-size: 14px;
    color: #343a40;
    background: white;
    outline: none;
    flex-grow: 1;
    box-sizing: border-box;
}

textarea:focus {
    background-color: #f8f9fa;
}

/* 自定义滚动条样式 */
textarea::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

textarea::-webkit-scrollbar-track {
    background: #f1f3f5;
    border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
    background: #ced4da;
    border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
    background: #adb5bd;
}
</style>