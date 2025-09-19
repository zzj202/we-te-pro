<template>
    <div class="container">
        <div class="header">
            <h1>用户管理系统</h1>
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-value">{{ totalUsers }}</span>
                    <span class="stat-label">总用户数</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">{{ activeUsers }}</span>
                    <span class="stat-label">活跃用户</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">{{ loggedIn ? '已登录' : '未登录' }}</span>
                    <span class="stat-label">当前状态</span>
                </div>
            </div>
        </div>

        <div class="search-bar">
            <input v-model="searchQuery" type="text" placeholder="搜索手机号..." class="search-input" />
            <button class="refresh-btn" @click="refreshData">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M23 4V10H17M1 20V14H7M21 10C19.9391 7.5289 17.9666 5.56643 15.5 4.505M3 14C4.0609 16.4711 6.03344 18.4336 8.5 19.495"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                刷新数据
            </button>
        </div>

        <div class="user-list">
            <div v-for="user in filteredUsers" :key="user.phone" class="user-card">
                <div class="user-info">
                    <div class="phone-number">
                        <span class="prefix">+86</span>
                        {{ formatPhoneNumber(user.phone) }}
                    </div>
                    <div class="user-meta">
                        <span class="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            注册: {{ formatDate(user.createdAt) }}
                        </span>
                        <span class="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            登录: {{ formatDate(user.lastLogin) }}
                        </span>
                        <span class="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            最近: {{ formatDate(user.lastActivity) }}
                        </span>
                        <span class="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 7H7M13 12H7M13 17H7M17 7H11M17 12H11M17 17H11" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            登录次数: {{ user.loginCount || 0 }}
                        </span>
                    </div>
                </div>
                <div class="user-actions">
                    <!-- <button class="action-btn" @click="copyPhone(user.phone)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        复制
                    </button>
                    <button class="action-btn" @click="sendSMS(user.phone)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        发送短信
                    </button> -->
                    <button class="action-btn danger" @click="deleteUser(user.phone)" v-if="!isCurrentUser(user.phone)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        删除
                    </button>
                </div>
            </div>
        </div>

        <div v-if="filteredUsers.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#4F46E5" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
            <h3>没有找到匹配的用户</h3>
            <p>请尝试不同的搜索条件</p>
        </div>

        <div v-if="showNotification" class="notification" :class="notificationType">
            {{ notificationMessage }}
        </div>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'race-layouts'
})
const userStore = useUserStore()

const searchQuery = ref('')
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success')

const loggedIn = computed(() => userStore.isLoggedIn)
const totalUsers = computed(() => userStore.totalUsers)
const activeUsers = computed(() => userStore.activeUsers)

const filteredUsers = computed(() => {
    if (!searchQuery.value) return userStore.users
    return userStore.users.filter(user =>
        user.phone.includes(searchQuery.value)
    )
})

onMounted(async () => {
    console.log(userStore.currentUser)
    await userStore.loadUsersFromRedis()
})

const refreshData = async () => {
    try {
        await userStore.loadUsersFromRedis()
        showNotificationMessage('数据刷新成功', 'success')
    } catch (error) {
        showNotificationMessage('刷新数据失败', 'error')
    }
}

const formatPhoneNumber = (phone) => {
    if (!phone) return ''
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}

const formatDate = (dateString) => {
    if (!dateString) return '未知'
    const date = new Date(dateString)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
const copyPhone = (phone) => {

    showNotificationMessage('暂不支持', 'success')
}

const sendSMS = (phone) => {
    console.log(`发送短信给: ${phone}`)
    showNotificationMessage(`模拟发送短信到 ${phone}`, 'info')
}

const deleteUser = async (phone) => {
    if (confirm(`确定要删除用户 ${phone} 吗？`)) {
        try {
            const index = userStore.users.findIndex(u => u.phone === phone)
            if (index >= 0) {
                userStore.users.splice(index, 1)
                await userStore.saveUsersToRedis()
                showNotificationMessage('用户删除成功', 'success')
            }
        } catch (error) {
            showNotificationMessage('删除用户失败', 'error')
        }
    }
}

const isCurrentUser = (phone) => {
    return userStore.currentUser?.phone === phone
}

const showNotificationMessage = (message, type) => {
    notificationMessage.value = message
    notificationType.value = type
    showNotification.value = true
    setTimeout(() => {
        showNotification.value = false
    }, 3000)
}
</script>

<style scoped>
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.header {
    margin-bottom: 32px;
    text-align: center;
}

.header h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 16px;
}

.stats {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 16px;
}

.stat-item {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 12px 20px;
    min-width: 100px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-value {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #4F46E5;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 14px;
    color: #6B7280;
}

.search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}

.search-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.refresh-btn {
    padding: 12px 16px;
    background: #f3f4f6;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #4F46E5;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.refresh-btn:hover {
    background: #e5e7eb;
}

.user-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.user-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    border-color: #4F46E5;
}

.user-info {
    flex: 1;
}

.phone-number {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8px;
}

.prefix {
    color: #6B7280;
    margin-right: 4px;
}

.user-meta {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: #6B7280;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.user-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    background: none;
    border: 1px solid #e5e7eb;
    color: #4F46E5;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: #f3f4f6;
}

.action-btn.danger {
    color: #ef4444;
    border-color: #fee2e2;
}

.action-btn.danger:hover {
    background: #fee2e2;
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
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    animation: fadeIn 0.3s ease;
}

.notification.success {
    background: #4F46E5;
    color: white;
}

.notification.error {
    background: #ef4444;
    color: white;
}

.notification.info {
    background: #3b82f6;
    color: white;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

@media (max-width: 768px) {
    .container {
        padding: 16px;
    }

    .stats {
        flex-direction: column;
        gap: 12px;
    }

    .stat-item {
        width: 100%;
    }

    .search-bar {
        flex-direction: column;
    }

    .user-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .user-actions {
        width: 100%;
        justify-content: flex-end;
    }
}
</style>