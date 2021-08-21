import axios from "axios"
import {appConfig, userConfig} from "@/plugins/config"
import Vue from "vue"

let appAxios = axios.create({
    baseURL: appConfig.baseUrl,
    headers: {
        Authorization: userConfig.get('adminKey')
    }
})
appAxios.interceptors.response.use(function (response) {
    // Do something with response data
    if (!response.data.status) {
        Vue.prototype.$helper.alert.error(response.data.data)
        return Promise.reject()
    }
    return response
}, function (error) {
    // Do something with response error
    Vue.prototype.$helper.alert.error('与伺服器连线时发生错误')
    return Promise.reject(error)
})
export {appAxios}
