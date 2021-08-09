import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import Novel from "@/views/Novel"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
        props: true
    },
    {
        path: '/novel/:novelId',
        name: 'Novel',
        component: Novel,
        props: true
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
