import router from './router';
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

const app = createApp(App);
app.use(router);
app.mount('#root');
