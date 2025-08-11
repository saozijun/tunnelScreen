<template>
    <div class="hbar-chart">
        <Echart :options="option" height="100%" width="50%" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Echart } from '@/components/Echart'
import * as echarts from 'echarts'
import { computeFontSize } from '@/utils'
let TP_value = 10;  // 温度
let kd = [];        // 刻度
let Gradient = [];  // 存放颜色的数组
let leftColor = ''; // 显示文本的颜色
let showValue = ''; // 显示内容 温度数字
let boxPosition = [65, 0];  // 显示内容的定位
let TP_txt = '';    // 显示内容 文本

// 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
for (let i = 0, len = 135; i <= len; i++) {
    if (i < 10 || i > 130) {
        kd.push('')
    }
    else {
        if ((i - 10) % 20 === 0) {
            kd.push('-6');
        }
        else if ((i - 10) % 4 === 0) {
            kd.push('-2');
        }
        else {
            kd.push('');
        }
    }
}

//中间线的渐变色和文本内容
if (TP_value > 20) {
    TP_txt = '温度偏高';
    Gradient.push({
        offset: 0,
        color: '#93FE94'
    }, {
        offset: 0.5,
        color: '#E4D225'
    }, {
        offset: 1,
        color: '#E01F28'
    })
}
else if (TP_value > -20) {
    TP_txt = '温度正常';
    Gradient.push({
        offset: 0,
        color: '#93FE94'
    }, {
        offset: 1,
        color: '#E4D225'
    })
}
else {
    TP_txt = '温度偏低';
    Gradient.push({
        offset: 1,
        color: '#93FE94'
    })
}
if (TP_value > 62) {
    showValue = 62
}
else {
    if (TP_value < -60) {
        showValue = -60
    }
    else {
        showValue = TP_value
    }
}
// 避免温度过低 右侧指示内容出界
if (TP_value < -10) {
    boxPosition = [65, -120];
}

leftColor = Gradient[Gradient.length - 1].color;
const option = ref({})
const generateOption = () => {
    option.value = {
        backgroundColor: '#1063a2',
        title: {
            text: '{a|31}{b|°C} \n {c|最高：32°C} \n {c|最低：26°C}',
            top: computeFontSize(40),
            right: computeFontSize(20),
            textStyle: {
                rich: {
                    a: {
                        fontSize: computeFontSize(42),
                        color: '#fff',
                        padding: [0, 0, 0, 4],
                    },
                    b: {
                        fontSize: computeFontSize(24),
                        color: '#fff',

                    },
                    c: {
                        fontSize: computeFontSize(16),
                        padding: [6, 0, 0, 0],
                        color: '#30c4ff',
                    },
                }
            }
        },
        grid: {
            left: computeFontSize(40),
            right: '0',
            bottom: computeFontSize(20),
            top: computeFontSize(10),
        },
        yAxis: [
            {
                show: false,
                data: [],
                min: 0,
                max: 135,
                axisLine: {
                    show: false
                }
            },
            {
                show: false,
                min: 0,
                max: 50,
            },
            {
                type: 'category',
                data: ['', '', '', '', '', '', '', '', '', '', '°C'],
                position: 'left',
                axisLabel: {
                    fontSize: computeFontSize(12),
                    margin: computeFontSize(20),
                    color: 'white'
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
            }
        ],
        xAxis: [
            {
                show: false,
                min: -18,
                max: 80,
                data: []
            },
            {
                show: false,
                min: -18,
                max: 80,
                data: []
            },
            {
                show: false,
                min: -18,
                max: 80,
                data: []
            },
            {
                show: false,
                min: -8,
                max: 80,
            }
        ],
        series: [{
            name: '条/温度计柱',
            type: 'bar',
            xAxisIndex: 0,
            data: [{
                value: (showValue + 70),
            }],
            barWidth: computeFontSize(8),
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
                }
            },
            z: 2
        }, {
            name: '白框/里面填充柱',
            type: 'bar',
            xAxisIndex: 1,
            barGap: '-100%',
            data: [134],
            barWidth: computeFontSize(12),
            itemStyle: {
                normal: {
                    color: '#0C2E6D',
                    barBorderRadius: 50,
                }
            },
            z: 1
        }, {
            name: '外框',
            type: 'bar',
            xAxisIndex: 2,
            barGap: '-100%',
            data: [135],
            barWidth: computeFontSize(14.75),
            itemStyle: {
                normal: {
                    color: '#4577BA',
                    barBorderRadius: 50,
                }
            },
            z: 0
        }, {
            name: '圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 0,
            symbolSize: computeFontSize(18),
            itemStyle: {
                normal: {
                    color: '#93FE94',
                    opacity: 1,
                }
            },
            z: 2
        }, {
            name: '白圆/温度计圆下方圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 1,
            symbolSize: computeFontSize(22.5),
            itemStyle: {
                normal: {
                    color: '#0C2E6D',
                    opacity: 1,
                }
            },
            z: 1
        }, {
            name: '外圆/最外层圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 2,
            symbolSize: computeFontSize(26.25),
            itemStyle: {
                normal: {
                    color: '#4577BA',
                    opacity: 1,
                }
            },
            z: 0
        }, {
            name: '刻度',
            type: 'bar',
            yAxisIndex: 0,
            xAxisIndex: 3,
            label: {
                normal: {
                    show: true,
                    position: 'left',
                    distance: computeFontSize(5),
                    color: 'white',
                    fontSize: computeFontSize(10),
                    formatter: function (params) {
                        if (params.dataIndex > 130 || params.dataIndex < 10) {
                            return '';
                        } else {
                            if ((params.dataIndex - 10) % 20 === 0) {
                                return params.dataIndex - 70;
                            } else {
                                return '';
                            }
                        }
                    }
                }
            },
            data: kd,
            barWidth: 1,
            itemStyle: {
                normal: {
                    color: 'white',
                    barBorderRadius: 120,
                }
            },
            z: 0
        }]
    }
}
onMounted(() => {
    generateOption()
    window.addEventListener('resize', generateOption)
})

onUnmounted(() => {
    window.removeEventListener('resize', generateOption)
})
</script>

<style scoped lang="scss">
.hbar-chart {
    width: 100%;
    height: 100%;
}
</style>
