// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // 服务端直接放行，由客户端处理认证
  if (process.server) return

  const appStore = useAppStore()
  const userStore = useUserStore()
  const whitelist = ['/login', '/']

  const updateList = ['/show']

  if (whitelist.includes(to.path)) {
    return
  }
  if (appStore.isAuthenticated() && userStore.isLoggedIn) {
    if (updateList.includes(to.path)) {
      userStore.updateUserActivity()
    }
    return
  }
  return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
})