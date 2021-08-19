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
        readingLinePadding: userConfig.get('readingLinePadding'),
        readingMdBlockTaken: userConfig.get('readingMdBlockTaken'),
        listingSingleColumn: userConfig.get('listingSingleColumn'),
        listingPerPage: userConfig.get('listingPerPage')
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
        },
        setReadingMdBlockTaken(state, value) {
            state.readingMdBlockTaken = value
            userConfig.set('readingMdBlockTaken', value)
        },
        setListingSingleColumn(state, value) {
            state.listingSingleColumn = value
            userConfig.set('listingSingleColumn', value)
        },
        setListingPerPage(state, value) {
            state.listingPerPage = value
            userConfig.set('listingPerPage', value)
        }
    },
    actions: {},
    modules: {}
})
