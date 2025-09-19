<template>
    <div class="trend-chart-container">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

// 注册 Chart.js 组件
Chart.register(...registerables)

const props = defineProps({
    lotteryData: {
        type: Array,
        required: true,
        default: () => []
    },
    // 要显示哪几个号码位置（0-6）
    showPositions: {
        type: Array,
        default: () => [6]
    }
})

const chartCanvas = ref(null)
let chartInstance = null

// 准备图表数据
const prepareChartData = () => {
    // 只取最近的30期数据，太多会导致图表拥挤
    const displayData = props.lotteryData.slice(0, 30).reverse();
    const labels = props.lotteryData.map((item, index) => `第${index + 1}期`).slice(-30); // 标签按原始顺序

    const datasets = props.showPositions.map(pos => {
        // 生成随机颜色
        const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
        return {
            label: `特码`,
            data: displayData.map(item => parseInt(item.numbers[pos])),
            borderColor: color,
            backgroundColor: color,
            tension: 0.1,
            pointRadius: 5,  // 增大点的大小
            borderWidth: 2,
            // 添加数据标签配置
            datalabels: {
                align: 'top',
                anchor: 'center',
                color: '#000',
                font: {
                    weight: 'bold'
                },
                formatter: (value) => value  // 显示数据值
            }
        }
    })

    return {
        labels,
        datasets
    }
}

// 初始化图表
const initChart = () => {
    if (chartInstance) {
        chartInstance.destroy()
    }
    if (chartCanvas.value && props.lotteryData.length > 0) {
        const ctx = chartCanvas.value.getContext('2d')

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: prepareChartData(),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '特码走势图',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    // // 数据标签插件配置
                    // datalabels: {
                    //     display: true,
                    //     color: '#000',
                    //     align: 'top',
                    //     anchor: 'center',
                    //     font: {
                    //         weight: 'bold',
                    //         size: 10
                    //     },
                    //     formatter: (value) => value
                    // }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 1,
                        max: 49,
                        ticks: {
                            stepSize: 5
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            },
            // 添加数据标签插件
            plugins: [{
                id: 'datalabels',
                afterDatasetsDraw(chart, args, options) {
                    const { ctx, data, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((point, index) => {
                            const value = dataset.data[index];
                            const xPos = point.x;
                            const yPos = point.y - 10; // 调整标签位置
                            ctx.fillStyle = '#000';
                            ctx.fillText(value, xPos, yPos);
                        });
                    });
                }
            }]
        })
    }
}

// 监听数据变化
watch(() => props.lotteryData, () => {
    initChart()
}, { deep: true })

// 组件挂载时初始化图表
onMounted(() => {
    initChart()
})
</script>

<style scoped>
.trend-chart-container {
    position: relative;
    width: 100%;
    min-height: 400px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin: 20px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>