export const useUserStore = defineStore('user', {
    state: () => ({
        usersPhone: [] as String[]
    }),
    actions: {
        //从redis上加载
        async loadFromKvAPI() {
            const kvAPI = userKvAPI()
            const categories = await kvAPI.get('users:phone')
            if (categories) {
                this.usersPhone = categories
            }
        },
        //保存redis
        async saveTokvAPI() {
            const kvAPI = userKvAPI()
            await kvAPI.set('users:phone', this.usersPhone)
        },
        async add(phone: string) {
            await this.loadFromKvAPI()
            if (!this.usersPhone.includes(phone)) {
                this.usersPhone.push(phone)
                await this.saveTokvAPI()
            }
        }
    },
    // persist: {
    //     storage: piniaPluginPersistedstate.localStorage(),
    // }
})