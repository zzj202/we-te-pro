export const useAppStore = defineStore('app', {
    state: () => ({
        abc: null as string | null,
        rightPassword: btoa('133')
    }),
    actions: {
        setPassword(pwd: string) {
            // 存储加密后的密码
            this.abc = btoa(pwd)
        },
        clearPassword() {
            this.abc = null
        },
        validatePassword(pwd: string): boolean {
            // 比较加密后的密码
            return btoa(pwd) === this.rightPassword
        },
        isAuthenticated(): boolean {
            // 比较加密后的密码
            return this.abc === this.rightPassword
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }
})