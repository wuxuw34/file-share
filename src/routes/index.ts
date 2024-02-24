import { createRouter, createWebHashHistory } from 'vue-router'

const home = import('../pages/index.vue')

const routes = [
    {
        path:'/',
        component:home
    },
    {
        path:'/res',
        component:home
    }
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router