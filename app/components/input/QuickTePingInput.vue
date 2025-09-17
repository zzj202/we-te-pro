<template>
    <div class="input-container">
        <div class="input-wrapper">
            <input type="text" v-model.trim="inputText" @input="processInput" placeholder="输入号码，如：06.18.30.16.28.40.03"
                class="input-field" />
            <span class="input-hint">输入1-7个01-49的数字，用空格/逗号/句号分隔（前六个平码，后一个特码）</span>
        </div>

        <div class="result-container" v-if="hasResult">
            <div class="result-section">
                <span class="result-label">平码:</span>
                <div class="number-bubbles">
                    <span v-for="(num, index) in flatCodes" :key="'ping-' + index" class="number-bubble">
                        {{ num }}
                    </span>
                </div>
            </div>

            <div class="result-section" v-if="specialCode">
                <span class="result-label">特码:</span>
                <span class="number-bubble special">{{ specialCode }}</span>
            </div>
        </div>


    </div>
</template>

<script setup lang="ts">

import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(
    ['message']
)
const props = defineProps({
    flatCodes: {
        type: Array as () => string[],
        default: () => []
    },
    specialCode: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['update:flatCodes', 'update:specialCode'])
const inputText = ref(props.flatCodes.length ? props.flatCodes.join(' ') + ' ' + props.specialCode : '')
const hasResult = computed(() => (props.flatCodes, props.flatCodes.length > 0) || props.specialCode !== '')


const processInput = () => {
    emit('update:flatCodes', [])
    emit('update:specialCode', '')
    // 清除所有分隔符，只保留数字
    const numbers = inputText.value.split(/[\s,.，、]+/).filter(n => n.trim() !== '')
    // 格式化为两位数
    const formattedNumbers = numbers.map(num => {
        const numInt = parseInt(num, 10)
        return numInt < 10 ? `0${numInt}` : `${numInt}`
    })
    if (formattedNumbers.length <= 6) {
        emit('update:flatCodes', formattedNumbers)
    } else {
        emit('update:specialCode', formattedNumbers[formattedNumbers.length - 1])
        emit('update:flatCodes', formattedNumbers.slice(0, -1))
    }

}
const check = (): boolean => {
    if (props.flatCodes.length !== 0) {
        if (props.flatCodes.length !== 6) {
            message.error(`平码数量不对，有${props.flatCodes.length}个`)
            return false
        }
        if (!props.specialCode) {
            message.error(`无特码`)
            return false
        }
        if (hasDuplicates(props.flatCodes)) {
            message.error(`平码中有相同号码`)
            return false
        }
        if (containsStringIgnoreCase(props.flatCodes, props.specialCode)) {
            message.error(`特码与平码有相同号码`)
            return false
        }
        const { valid, invalidNumbers } = validateNumbersInRange1to49WithDetails([...props.flatCodes, props.specialCode])
        if (!valid) {
            message.error(`号码不符合${invalidNumbers.join(',')}`)
            return false
        }
        return true
    } else {
        return true
    }
}
// 暴露方法给父组件
defineExpose({
    check: check,
})
</script>

<style scoped>
.input-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 12px;
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.input-wrapper {
    margin-bottom: 16px;
}

.input-field {
    padding: 12px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.input-field:focus {
    border-color: #4f46e5;
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}


.input-hint {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: #757575;
}

.result-container {
    margin-top: 20px;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.result-section {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.result-section:last-child {
    margin-bottom: 0;
}

.result-label {
    font-weight: 600;
    color: #333;
    margin-right: 12px;
    min-width: 40px;
}

.number-bubbles {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.number-bubble {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background-color: #4a90e2;
    color: white;
    border-radius: 50%;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.number-bubble.special {
    background-color: #ff6b6b;
    width: 42px;
    height: 42px;
    font-size: 18px;
}


@media (max-width: 480px) {
    .input-container {
        padding: 16px;
    }

    .input-field {
        padding: 10px 14px;
    }

    .number-bubble {
        width: 32px;
        height: 32px;
        font-size: 14px;
    }

    .number-bubble.special {
        width: 36px;
        height: 36px;
    }
}
</style>