import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import Novel from "@/views/Novel"
import BookSource from "@/views/BookSource"

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
    },
    {
        path: '/book-source',
        name: 'BookSource',
        component: BookSource,
        props: true
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
