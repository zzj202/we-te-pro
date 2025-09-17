export const useAppStore = defineStore('app', {
    state: () => ({
        password: null as string | null,
        correctPassword: btoa('133')
    }),
    actions: {
        setPassword(pwd: string) {
            // 存储加密后的密码
            this.password = btoa(pwd)
        },
        clearPassword() {
            this.password = null
        },
        validatePassword(pwd: string): boolean {
            // 比较加密后的密码
            return btoa(pwd) === this.correctPassword
        },
        isAuthenticated(): boolean {
            // 比较加密后的密码
            return this.password === this.correctPassword
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})