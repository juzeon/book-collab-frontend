import Vue from 'vue'
import Vuex from 'vuex'
import colors from 'vuetify/lib/util/colors'
import {userConfig} from "@/plugins/config"

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        themeColor: colors.green.base,
        snackBarOpen: false,
        snackBarText: '',
        readingFontSize: userConfig.get('readingFontSize'),
        readingLinePadding: userConfig.get('readingLinePadding')
    },
    mutations: {
        setThemeColors(state, newColor) {
            let colorsMap = {
                green: colors.green.base,
                blue: colors.blue.base,
                pink: colors.pink.base
            }
            state.themeColor = colorsMap[newColor]
        },
        openSnackBar(state, text) {
            state.snackBarOpen = true
            state.snackBarText = text
        },
        setSnackBarStatus(state, status) {
            state.snackBarOpen = status
        },
        setReadingFontSize(state, value) {
            state.readingFontSize = value
            userConfig.set('readingFontSize', value)
        },
        setReadingLinePadding(state, value) {
            state.readingLinePadding = value
            userConfig.set('readingLinePadding', value)
        }
    },
    actions: {},
    modules: {}
})
