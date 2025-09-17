export const useAppStore = defineStore('app', {
    state: () => ({
        password: null as string | null,
        // 你可以设置一个默认密码，或者从环境变量中读取
        correctPassword: process.env.DEFAULT_PASSWORD || 'admin123'
    }),
    actions: {
        setPassword(pwd: string) {
            this.password = pwd
        },
        clearPassword() {
            this.password = null
        },
        validatePassword(pwd: string): boolean {
            return pwd === this.correctPassword
        },
        isAuthenticated(): boolean {
            return this.password === this.correctPassword
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})