import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // Import router.js vào đây

createApp(App)
    .use(router)  // Đăng ký Vue Router với ứng dụng
    .mount('#app')
