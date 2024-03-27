<template>
    <Empty v-if="isSeriesEmpty" description="暂无数据，请到App.vue将注释的dataList数据打开" />
    <chart-pie v-else v-bind="$props" />
</template>
<script setup>
import { isEmpty } from "lodash";
import ChartPie from "./chartPie.vue";
import { Empty } from "vant";

</script>