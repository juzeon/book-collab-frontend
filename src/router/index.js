import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import Novel from "@/views/Novel"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/novel/:id',
        name: 'Novel',
        component: Novel
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
