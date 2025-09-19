<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-container">
          <svg class="logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
              fill="#4F46E5" />
            <path
              d="M12 6c-3.313 0-6 2.687-6 6s2.687 6 6 6 6-2.687 6-6-2.687-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
              fill="#4F46E5" />
            <circle cx="12" cy="12" r="2" fill="#4F46E5" />
          </svg>
        </div>
        <h1>欢迎回来</h1>
        <p>请验证您的身份</p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <div class="input-container">
            <input id="phone" v-model="phone" type="tel" placeholder=" " class="form-input" @focus="clearErrors"
              @input="validatePhone" />
            <label for="phone">手机号</label>
            <div class="underline"></div>
          </div>
          <transition name="fade">
            <p v-if="phoneError" class="error-message small-error">
              <svg class="error-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ phoneError }}
            </p>
          </transition>
        </div>

        <div class="form-group">
          <div class="input-container">
            <input id="password" v-model="password" type="password" placeholder=" " class="form-input"
              @focus="clearErrors" />
            <label for="password">密码</label>
            <div class="underline"></div>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span class="btn-text">继续</span>
          <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>

        <transition name="fade">
          <p v-if="error" class="error-message">
            <svg class="error-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ error }}
          </p>
        </transition>
      </form>

      <div class="login-footer">
        <p>遇到问题？<a href="#" class="help-link">获取帮助</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'custom-layouts'
})

const route = useRoute()
const userStroe = useUserStore()
const appStore = useAppStore()
const raceStore = useRaceStore()
const phone = ref('')
const password = ref('')
const error = ref('')
const phoneError = ref('')
const isSubmitting = ref(false)

// 手机号验证规则
const validatePhone = () => {
  const phoneRegex = /^1[3-9]\d{9}$/ // 中国大陆手机号正则
  if (!phone.value) {
    phoneError.value = '请输入手机号'
  } else if (!phoneRegex.test(phone.value)) {
    phoneError.value = '请输入正确的手机号'
  } else {
    phoneError.value = ''
  }
}

const clearErrors = () => {
  error.value = ''
  phoneError.value = ''
}

const handleSubmit = async () => {
  // 验证手机号
  validatePhone()

  if (phoneError.value) {
    return
  }

  if (!password.value) {
    error.value = '请输入密码'
    return
  }

  isSubmitting.value = true

  try {
    if (appStore.validatePassword(password.value)) {
      appStore.setPassword(password.value)
      const redirectPath = route.query.redirect || '/'
      await raceStore.loadFromKvAPI()
      await userStroe.userLogin(phone.value)
      navigateTo(redirectPath)
    } else {
      error.value = '密码错误，请重试'
      password.value = '' // 清空密码输入框
    }
  } catch (err) {
    error.value = '登录失败，请稍后再试'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.1);
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  margin: 40px;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%);
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(79, 70, 229, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 56px;
  height: 56px;
  margin: 0 auto;
}

.login-header h1 {
  color: #1F2937;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.login-header p {
  color: #6B7280;
  font-size: 15px;
}

.form-group {
  margin-bottom: 28px;
  position: relative;
}

.input-container {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 16px 0 8px 0;
  border: none;
  border-bottom: 1px solid #D1D5DB;
  font-size: 16px;
  background: transparent;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-bottom-color: #4F46E5;
}

.form-input:focus+label,
.form-input:not(:placeholder-shown)+label {
  transform: translateY(-20px) scale(0.85);
  color: #4F46E5;
}

.form-input::placeholder {
  opacity: 0;
}

label {
  position: absolute;
  left: 0;
  top: 16px;
  color: #6B7280;
  font-size: 16px;
  transition: all 0.3s ease;
  pointer-events: none;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #4F46E5;
  transition: width 0.4s ease;
}

.form-input:focus~.underline {
  width: 100%;
}

.login-form {
  position: relative;
  margin-bottom: 10px;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.1);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(79, 70, 229, 0.15);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-text {
  margin-right: 8px;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.submit-btn:hover:not(:disabled) .arrow-icon {
  transform: translateX(4px);
}

.error-message {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  right: 0;
  color: #DC2626;
  background: #FEF2F2;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  animation: shake 0.5s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.small-error {
  position: relative;
  bottom: -5px;
  margin-top: 8px;
  animation: none;
}

.error-icon {
  margin-right: 10px;
  color: #DC2626;
}

.login-footer {
  margin-top: 32px;
  text-align: center;
  color: #9CA3AF;
  font-size: 14px;
}

.help-link {
  color: #4F46E5;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.help-link:hover {
  color: #3730A3;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  20%,
  60% {
    transform: translateX(-5px);
  }

  40%,
  80% {
    transform: translateX(5px);
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }

  .login-header h1 {
    font-size: 24px;
  }
}
</style>