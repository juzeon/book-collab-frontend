import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import Novel from "@/views/Novel"
import BookSource from "@/views/BookSource"
import Settings from "@/views/Settings"
import Read from "@/views/Read"
import DMCA from "@/views/DMCA"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
        props: true
    },
    {
        path: '/novel/:novelId(\\d+)',
        name: 'Novel',
        component: Novel,
        props: true
    },
    {
        path: '/book-source',
        name: 'BookSource',
        component: BookSource,
        props: true
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
        props: true
    },
    {
        path: '/novel/:novelId(\\d+)/viewType/:viewType/chapter/:rawOrderId(\\d+)',
        name: 'Read',
        component: Read,
        props: true
    },
    {
        path: '/dmca',
        name: 'DMCA',
        component: DMCA,
        props: true
    },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
