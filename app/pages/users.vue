<template>
    <div class="phone-list-container">
        <div class="header">
            <h1>用户手机号列表</h1>
            <p class="subtitle">共 {{ userStroe.usersPhone.length }} 个注册用户</p>
        </div>

        <div class="phone-list">
            <div v-for="(phone, index) in userStroe.usersPhone" :key="index" class="phone-card">
                <div class="phone-index">{{ index + 1 }}</div>
                <div class="phone-number">
                    <span class="prefix">+86</span>
                    {{ formatPhoneNumber(phone) }}
                </div>
                <div class="actions">
                    <button class="action-btn" @click="copyToClipboard(phone)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        复制
                    </button>
                    <button class="action-btn" @click="sendSMS(phone)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        发送短信
                    </button>
                </div>
            </div>
        </div>

        <div v-if="userStroe.usersPhone.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#4F46E5" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
            <h3>暂无用户数据</h3>
            <p>当前没有注册用户的手机号信息</p>
        </div>

        <transition name="fade">
            <div v-if="showCopySuccess" class="notification">
                已复制到剪贴板
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { createDiscreteApi } from 'naive-ui'

definePageMeta({
    layout: 'race-layouts'
})
const { message } = createDiscreteApi(
    ['message']
)
const userStroe = useUserStore()
const showCopySuccess = ref(false)

onMounted(async () => {
    await userStroe.loadFromKvAPI()
})


const formatPhoneNumber = (phone) => {
    if (!phone) return ''
    // 格式化为 123-4567-8910
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}

const copyToClipboard = (phone) => {
    message.warnning(`暂不支持`)
    // navigator.clipboard.writeText(phone)
    // showCopySuccess.value = true
    // setTimeout(() => {
    //     showCopySuccess.value = false
    // }, 2000)
}

const sendSMS = (phone) => {
    // 这里可以添加发送短信的逻辑
    console.log(`发送短信给: ${phone}`)
}
</script>

<style scoped>
.phone-list-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 32px;
}

.header {
    text-align: center;
    margin-bottom: 32px;
}

.header h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 8px;
}

.subtitle {
    font-size: 16px;
    color: #6B7280;
}

.phone-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 16px;
    margin-top: 24px;
}

.phone-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    border: 1px solid #E5E7EB;
}

.phone-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    border-color: #4F46E5;
}

.phone-index {
    width: 32px;
    height: 32px;
    background: #4F46E5;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 16px;
    flex-shrink: 0;
}

.phone-number {
    flex-grow: 1;
    font-size: 16px;
    font-weight: 500;
    color: #1F2937;
}

.prefix {
    color: #6B7280;
    margin-right: 4px;
}

.actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    background: none;
    border: none;
    color: #4F46E5;
    font-size: 14px;
    font-weight: 500;
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: #F3F4F6;
}

.action-btn svg {
    stroke: currentColor;
}

.empty-state {
    text-align: center;
    padding: 48px 0;
    background: #F9FAFB;
    border-radius: 12px;
    margin-top: 32px;
}

.empty-state h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
    margin: 16px 0 8px;
}

.empty-state p {
    color: #6B7280;
    font-size: 16px;
}

.notification {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #4F46E5;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 768px) {
    .phone-list-container {
        padding: 24px 16px;
    }

    .phone-list {
        grid-template-columns: 1fr;
    }
}
</style>