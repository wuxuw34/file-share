import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import 'element-plus/dist/index.css'
import router from './routes'
const app =  createApp(App)
app.use(router)
app.mount('#app')
