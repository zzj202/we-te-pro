// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // 服务端直接放行，由客户端处理认证
  if (process.server) return

  const appStore = useAppStore()
  const whitelist = ['/login', '/']

  if (whitelist.includes(to.path) || appStore.isAuthenticated()) {
    return
  }

  return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
})