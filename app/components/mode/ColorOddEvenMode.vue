<template>
    <div class="lottery-result" :class="{ 'invalid-state': !mainStore.isValid(index) }">
        <div class="input-section">
            <div class="editable-input-container">
                <input v-model="editableValue" @input="updateInputValue" class="editable-input"
                    placeholder="输入生肖和金额，例如：鼠 牛 虎 各2" />
                <span class="input-hint">格式：x头 或x尾 各30</span>
            </div>
        </div>

        <ResultArea :amount="amount" :selected-numbers="selectedNumbers" :total-amount="totalAmount" />

        <ErrorDisplayArea v-if="errorMessage" :message="errorMessage" />
    </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import ResultArea from '@/components/area/ResultArea.vue';
import ErrorDisplayArea from '@/components/area/ErrorDisplayArea.vue'
import { LOTTERY_NUMBER_CATEGORIES } from '~/constants/race.constants';

const mainStore = useMainStore();
const props = defineProps({
    index: {
        type: Number,
        required: true
    }
});


// 处理输入值
const inputValue = computed(() => {
    resetValidation();
    const result = mainStore.getLineInputValue(props.index) || '';
    editableValue.value = result;
    validateInput(result);
    return result || '';
});
// 更新存储中的值
const updateInputValue = () => {
    mainStore.updateBetLine(props.index, editableValue.value);
};
const editableValue = ref(mainStore.getLineInputValue(props.index) || '');
const amount = ref(0);
const errorMessage = ref('');
const changeToNumber = LOTTERY_NUMBER_CATEGORIES


// 获取选中的号码
// 获取选中的号码
const selectedNumbers = computed(() => {
    let result = [];
    const input = inputValue.value.toLowerCase(); // 转换为小写方便比较
    const amountMatch = input.match(/\d+/g)  //提取数字
    if (!amountMatch || amountMatch.length !== 1) {
        errorMessage.value = '金额格式错误';
        return []
    }
    if (
        (input.includes('红') && input.includes('蓝')) ||
        (input.includes('红') && input.includes('绿')) ||
        (input.includes('蓝') && input.includes('绿')) ||
        (input.includes('红') && input.includes('蓝') && input.includes('绿'))
    ) {
        errorMessage.value = '同时有多种波色，请分开输入';
        return []
    }
    let typeStr = ''
    let descriptionStr = ''
    if (input.includes('双')) {
        if (input.includes('大双')) {
            typeStr = '单双'
            descriptionStr = '大双'
            result = changeToNumber.大双;
        } else if (input.includes('小双')) {
            typeStr = '单双'
            descriptionStr = '小双'
            result = changeToNumber.小双;
        } else if (input.includes('蓝') || input.includes('蓝波')) {
            result = changeToNumber.蓝双;
            typeStr = '波色'
            descriptionStr = '蓝双'
        } else if (input.includes('红') || input.includes('红波')) {
            result = changeToNumber.红双;
            typeStr = '波色'
            descriptionStr = '红双'
        } else if (input.includes('绿') || input.includes('绿波')) {
            result = changeToNumber.绿双;
            typeStr = '波色'
            descriptionStr = '绿双'
        } else {
            result = changeToNumber.双;
            typeStr = '单双'
            descriptionStr = '双数'
        }
    }
    else if (input.includes('单')) {
        if (input.includes('大单')) {
            result = changeToNumber.大单;
            typeStr = '单双'
            descriptionStr = '大单'
        } else if (input.includes('小单')) {
            result = changeToNumber.小单;
            typeStr = '单双'
            descriptionStr = '小单'
        } else if (input.includes('蓝') || input.includes('蓝波')) {
            result = changeToNumber.蓝单;
            typeStr = '波色'
            descriptionStr = '蓝单'
        } else if (input.includes('红') || input.includes('红波')) {
            result = changeToNumber.红单;
            typeStr = '波色'
            descriptionStr = '红单'
        } else if (input.includes('绿') || input.includes('绿波')) {
            result = changeToNumber.绿单;
            typeStr = '波色'
            descriptionStr = '绿单'
        } else {
            result = changeToNumber.单;
            typeStr = '单双'
            descriptionStr = '单数'
        }
    }
    else if (input.includes('绿') || input.includes('绿波')) {
        if (input.includes('小')) {
            result = changeToNumber.绿波.filter(num => parseInt(num) < 25);
        } else if (input.includes('大')) {
            result = changeToNumber.绿波.filter(num => parseInt(num) >= 25);
        } else {
            result = changeToNumber.绿波;
        }
        typeStr = '波色'
        descriptionStr = '绿波'
    }
    else if (input.includes('红') || input.includes('红波')) {
        if (input.includes('小')) {
            result = changeToNumber.红波.filter(num => parseInt(num) < 25);
        } else if (input.includes('大')) {
            result = changeToNumber.红波.filter(num => parseInt(num) >= 25);
        } else {
            result = changeToNumber.红波;
        }
        typeStr = '波色'
        descriptionStr = '红波'
    }
    else if (input.includes('蓝') || input.includes('蓝波')) {
        if (input.includes('小')) {
            result = changeToNumber.蓝波.filter(num => parseInt(num) < 25);
        } else if (input.includes('大')) {
            result = changeToNumber.蓝波.filter(num => parseInt(num) >= 25);
        } else {
            result = changeToNumber.蓝波;
        }
        typeStr = '波色'
        descriptionStr = '蓝波'
    }
    else if (input.includes('大')) {
        result = changeToNumber.大;
        typeStr = '大小'
        descriptionStr = '大数'
    }
    else if (input.includes('小')) {
        result = changeToNumber.小;
        typeStr = '大小'
        descriptionStr = '小数'
    }
    mainStore.setType(props.index, typeStr);
    mainStore.setDescription(props.index, descriptionStr);
    return result || [];
});

// 计算总金额
const totalAmount = computed(() => selectedNumbers.value.length * amount.value);

// 验证输入有效性
const isValid = computed(() => amount.value > 0 && selectedNumbers.value.length > 0);

// 重置验证状态
const resetValidation = () => {
    errorMessage.value = '';
    amount.value = 0;
};

// 验证输入
const validateInput = (input) => {
    input = input.split(/共|合计/)[0]
    if (!input) return;
    const amountMatch = input.match(/\d+/g)
    if (!amountMatch || amountMatch.length !== 1) {
        errorMessage.value = '金额格式错误';
        return;
    }
    if (input.includes('个') || input.includes('个数') || input.includes('各') || input.includes('各数')) {
        amount.value = Number(amountMatch[0]);
    } else {
        errorMessage.value = '金额不准确，请明确是否为 ‘各数’。 请在金额前添加‘各’即可';
    }
};

// 监听有效性变化
watchEffect(() => {
    if (isValid.value) {
        mainStore.setBetLineValid(props.index);
        mainStore.setSelectNumbers(props.index, selectedNumbers.value);
        mainStore.setAmount(props.index, amount.value);
        mainStore.setInputValue(props.index, inputValue.value);
    } else {
        mainStore.setBetLineInvalid(props.index);
    }
});
</script>

<style scoped>
/* 样式保持不变 */
.lottery-result {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    max-width: 680px;
    margin: 0 auto;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.lottery-result.invalid-state {
    background-color: #fff0f0;
    border: 1px solid #ffcccc;
    box-shadow: 0 4px 12px rgba(255, 0, 0, 0.1);
}

.input-section {
    margin-bottom: 12px;
}


.editable-input-container {
    position: relative;
    margin-bottom: 15px;
}

.editable-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: all 0.3s;
    box-sizing: border-box;
    background-color: #f9f9f9;
}

.editable-input:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    background-color: #fff;
}

.input-hint {
    display: block;
    font-size: 0.8rem;
    color: #888;
    margin-top: 5px;
    padding-left: 5px;
}

@media (max-width: 600px) {
    .lottery-result {
        padding: 15px;
    }

    .editable-input {
        padding: 10px 12px;
        font-size: 15px;
    }
}
</style>