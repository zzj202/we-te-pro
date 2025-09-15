export default defineNuxtRouteMiddleware((to, from) => {
    const appStore = useAppStore()

    // 定义不需要密码的白名单路由
    const whitelist = ['/login','/']

    if (whitelist.includes(to.path) || appStore.isAuthenticated()) {
        return
    }

    // 将原始目标路径存储在query参数中
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
})