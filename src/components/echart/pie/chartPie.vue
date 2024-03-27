<template>
    <div ref="chartRef" class="chart"></div>
</template>
<script setup>
import { defineProps, ref, onMounted, onUnmounted, watch, inject} from 'vue';
import { merge } from 'lodash';
// import * as echarts from 'echarts';
import ResizeListener from 'element-resize-detector';
import {COLORSARRAY} from '../color.js';
import {BASEOPTIONS} from './defaultOptions.js';
let echartInstance = null;
// 导入全局挂载的echarts
const echarts = inject("$echarts");

// 使用vue的refs声明dom节点，方便后续操作
const chartRef = ref(null);
const props = defineProps({
    // 正常的业务数据，对应echarts饼图配置中series[0].data
    seriesData: {
        type: Array,
        required: true,
        default: () => [],
    },
    // 表示需要特殊定制的配置
    // 一般UI会规定一个统一的设计规范（比如颜色，字体，图例格式，位置等）
    // 但不排除某个图标会和设计规范不同，需要特殊定制样式，所以开放这个配置，增强灵活性
    extraOption: {
        type: Object,
        default: () => ({}),
    },
});
// 监控seriesData的变化，当变化时更新echart视图
watch(() => props.seriesData, () => {
    updateChartView();
});

/**
 * 对chart元素尺寸进行监听，当发生变化时同步更新echart视图
 */
const addChartResizeListener = () => {
    const instance = ResizeListener({
        strategy: 'scroll',
        callOnAdd: true,
    });
    instance.listenTo(chartRef.value, () => {
        if (chartRef.value) {
            // chartRef.value.resize();
            echartInstance.resize();
        }
        
    });
};
/**
 * 当窗口缩放时，echart动态调整自身大小
 */
const handleWindowResize = () => {
    if (chartRef.value) {
        echartInstance.resize();
        // chartRef.value?.resize();
    }
};
const assembleDataToOption = (seriesData) => {
    // 这部分的图例formatter取决于UI要求，如果你的项目中不需要，就可以不写formatter
    // 由于echarts版本的迭代，这里的写法也有稍许改变
    const formatter = (name) => {
        const total = props.seriesData.reduce((acc, cur) => acc + cur.value, 0);
        const data = props.seriesData.find((item) => item.name === name) || {};
        const percent = data.value ? `${Math.round((data.value / total) * 100)}%` : '0%';
        return `${name} ${percent}`;
    };

    return merge(
        {},
        BASEOPTIONS,
        { color: COLORSARRAY },
        {
            legend: { formatter },
            series: [{ data: props.seriesData }],
        },
        props.extraOption
    );
};
const updateChartView = () => {
    if (!chartRef.value) return;
    const fullOption = assembleDataToOption();
    echartInstance = echarts.init(chartRef.value);
    echartInstance.setOption(fullOption);
};
onMounted(() => {
    // echarts.init(chartRef.value)
    updateChartView();
    window.addEventListener('resize', handleWindowResize);
    addChartResizeListener();
});
onUnmounted(() => {
    window.removeEventListener('resize', handleWindowResize);
});
</script>
<style lang="less">
.chart {
    width: 100%;
    height: 100%;
}
</style>
