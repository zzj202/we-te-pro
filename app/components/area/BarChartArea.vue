<template>
    <div class="frequency-chart-container">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// 注册 Chart.js 组件
Chart.register(...registerables, ChartDataLabels)

const props = defineProps({
    frequencyData: {
        type: Object,
        required: true,
        default: () => ({})
    },
    // 要显示的号码范围
    numberRange: {
        type: Array,
        default: () => [1, 49]
    }
})

const chartCanvas = ref(null)
let chartInstance = null

// 准备图表数据
const prepareChartData = () => {
    // 将频率数据转换为数组并按号码排序
    const numbers = Object.keys(props.frequencyData)
        .map(num => parseInt(num))
        .sort((a, b) => a - b)
        .filter(num => num >= props.numberRange[0] && num <= props.numberRange[1])

    const frequencies = numbers.map(num => props.frequencyData[num.toString().padStart(2, '0')])

    // 生成颜色数组 - 热力图效果
    const maxFreq = Math.max(...frequencies)
    const minFreq = Math.min(...frequencies)
    const colorRange = 120 // 从绿色(60)到红色(0)

    const backgroundColors = frequencies.map(freq => {
        const ratio = (freq - minFreq) / (maxFreq - minFreq)
        const hue = 60 - (ratio * colorRange)
        return `hsl(${hue}, 80%, 60%)`
    })

    return {
        labels: numbers.map(num => num.toString().padStart(2, '0')),
        datasets: [{
            label: '出现次数',
            data: frequencies,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('60%)', '40%)')),
            borderWidth: 1,
            borderRadius: 3, // 圆角柱状图
            hoverBackgroundColor: backgroundColors.map(color => color.replace('60%)', '70%)')),
            hoverBorderColor: backgroundColors.map(color => color.replace('60%)', '30%)')),

        }]
    }
}

// 初始化图表
const initChart = () => {
    if (chartInstance) {
        chartInstance.destroy()
    }
    if (chartCanvas.value && Object.keys(props.frequencyData).length > 0) {
        const ctx = chartCanvas.value.getContext('2d')

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: prepareChartData(),
            plugins: [ChartDataLabels], // 添加数据标签插件
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '号码出现频率统计',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `号码 ${context.label}: ${context.raw} 次`
                            }
                        }
                    },
                    // 数据标签配置
                    datalabels: {
                        anchor: 'end', // 标签位置在柱子末端
                        align: 'top', // 标签对齐方式
                        color: '#000', // 标签颜色
                        font: {
                            weight: 'bold', // 字体加粗
                            size: 10 // 字体大小
                        },
                        formatter: (value) => value // 显示数据值
                    }
                },
                scales: {
                    // y: {
                    //     beginAtZero: true,
                    //     title: {
                    //         display: true,
                    //         text: '出现次数'
                    //     },
                    //     ticks: {
                    //         stepSize: 5
                    //     }
                    // },
                    x: {
                        title: {
                            display: true,
                            text: '号码'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                // 添加动画效果
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        })
    }
}

// 监听数据变化
watch(() => props.frequencyData, () => {
    initChart()
}, { deep: true })

// 组件挂载时初始化图表
onMounted(() => {
    initChart()
})
</script>

<style scoped>
.frequency-chart-container {
    position: relative;
    width: 100%;
    min-height: 300px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin: 20px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>