import { createApp } from 'vue';
import echarts from './plugins/echarts';
import './style.css';
import App from './App.vue';
const app = createApp(App);
// 全局挂载
app.provide("$echarts", echarts);
// 挂载dom
app.mount('#app');
