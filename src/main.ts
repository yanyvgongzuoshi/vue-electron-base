import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import 'element-plus/dist/index.css'
import './assets/main.css'
import router from './router'
import sendRequest from './tools/sendRequest'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// @ts-ignore
app.use(sendRequest, { electron: window.electron })

app.mount('#app')
