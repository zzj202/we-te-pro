// stores/user.ts

import type { UserInfo } from "~/types/user.types"

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [] as UserInfo[],
        currentUser: null as UserInfo | null
    }),

    actions: {
        // 从Redis加载所有用户数据
        async loadUsersFromRedis() {
            const kvAPI = userKvAPI()
            const usersData = await kvAPI.get('users:list')
            if (usersData) {
                this.users = usersData
            }
        },

        // 保存所有用户数据到Redis
        async saveUsersToRedis() {
            const kvAPI = userKvAPI()
            await kvAPI.set('users:list', this.users)
        },

        // 用户登录
        async userLogin(phone: string) {
            await this.loadUsersFromRedis()
            const now = new Date().toISOString()
            let user = this.users.find(u => u.phone === phone)
            if (!user) {
                // 新用户
                user = {
                    phone,
                    createdAt: now,
                    lastLogin: now,
                    lastActivity: now,
                    loginCount: 1
                }
                this.users.push(user)
            } else {
                // 已有用户
                user.lastLogin = now
                user.lastActivity = now
                user.loginCount = (user.loginCount || 0) + 1
            }
            this.currentUser = user
            await this.saveUsersToRedis()
        },

        // 更新用户最后活动时间
        async updateUserActivity() {
            await this.loadUsersFromRedis()
            if (!this.currentUser) return
            const now = new Date().toISOString()
            this.currentUser.lastActivity = now
            // 更新users数组中的对应记录
            const index = this.users.findIndex(u => u.phone === this.currentUser?.phone)
            if (index >= 0) {
                this.users[index] = this.currentUser
            }
            await this.saveUsersToRedis()
        },
        // 用户登出
        async userLogout() {
            if (this.currentUser) {
                await this.updateUserActivity()
                this.currentUser = null
            }
        },

        // 获取用户信息
        async getUserInfo(phone: string): Promise<UserInfo | null> {
            await this.loadUsersFromRedis()
            return this.users.find(u => u.phone === phone) || null
        }
    },

    getters: {
        isLoggedIn: (state) => !!state.currentUser,
        totalUsers: (state) => state.users.length,
        activeUsers: (state) => {
            const oneDayAgo = new Date()
            oneDayAgo.setDate(oneDayAgo.getDate() - 1)
            return state.users.filter(u => new Date(u.lastActivity) > oneDayAgo).length
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})