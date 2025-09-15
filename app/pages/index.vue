<template>
  <div class="construction-container">
    <div class="construction-content">
      <div class="construction-illustration">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 12l-3 9"/>
          <path d="M9 3l3 9"/>
        </svg>
      </div>
      <h1 class="construction-title">网站正在建设中</h1>
      <p class="construction-message">我们正在努力打造更好的体验</p>
      <div class="construction-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{width: progress + '%'}"></div>
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>
      <div class="construction-countdown">
        <p>预计上线时间: <span class="highlight">2025年10月1日</span></p>
        <div class="countdown-timer">
          <div class="countdown-item">
            <span class="countdown-value">{{ days }}</span>
            <span class="countdown-label">天</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">{{ hours }}</span>
            <span class="countdown-label">时</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">{{ minutes }}</span>
            <span class="countdown-label">分</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">{{ seconds }}</span>
            <span class="countdown-label">秒</span>
          </div>
        </div>
      </div>
      <div class="construction-contact">
        <p>如需提前了解，请联系我们</p>
        <a href="mailto:contact@example.com" class="contact-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          联系我们
        </a>
      </div>
      <div class="construction-social">
        <a href="#" class="social-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const progress = ref(65)
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const updateCountdown = () => {
  const targetDate = new Date('2025-10-01T00:00:00')
  const now = new Date()
  const diff = targetDate - now
  
  if (diff <= 0) {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    return
  }
  
  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000)
}

onMounted(() => {
  updateCountdown()
  setInterval(updateCountdown, 1000)
  
  // 模拟进度条动画
  const interval = setInterval(() => {
    if (progress.value < 95) {
      progress.value += Math.random() * 5
    } else {
      clearInterval(interval)
    }
  }, 2000)
})
</script>

<style scoped>
.construction-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.construction-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.construction-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%);
}

.construction-illustration {
  margin-bottom: 2rem;
}

.construction-illustration svg {
  width: 100px;
  height: 100px;
  color: #4F46E5;
  animation: pulse 2s infinite;
}

.construction-title {
  font-size: 2.2rem;
  color: #1F2937;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.construction-message {
  font-size: 1.1rem;
  color: #6B7280;
  margin-bottom: 2rem;
}

.construction-progress {
  margin: 2rem 0;
}

.progress-bar {
  height: 10px;
  background: #E5E7EB;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #4F46E5;
  font-weight: 600;
}

.construction-countdown {
  margin: 2rem 0;
}

.construction-countdown p {
  color: #6B7280;
  margin-bottom: 1rem;
}

.highlight {
  color: #4F46E5;
  font-weight: 600;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.countdown-item {
  background: #F3F4F6;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  min-width: 70px;
}

.countdown-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1F2937;
  display: block;
}

.countdown-label {
  font-size: 0.8rem;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.construction-contact {
  margin: 2rem 0;
}

.construction-contact p {
  color: #6B7280;
  margin-bottom: 1rem;
}

.contact-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #4F46E5;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.contact-button:hover {
  background: #4338CA;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(79, 70, 229, 0.2);
}

.contact-button svg {
  width: 16px;
  height: 16px;
}

.construction-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.social-icon {
  color: #6B7280;
  transition: all 0.3s ease;
}

.social-icon:hover {
  color: #4F46E5;
  transform: translateY(-2px);
}

.social-icon svg {
  width: 20px;
  height: 20px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .construction-content {
    padding: 2rem 1.5rem;
  }
  
  .construction-title {
    font-size: 1.8rem;
  }
  
  .countdown-item {
    min-width: 60px;
    padding: 0.6rem 0.8rem;
  }
  
  .countdown-value {
    font-size: 1.5rem;
  }
}
</style>