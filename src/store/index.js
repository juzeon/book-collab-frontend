import Vue from 'vue'
import Vuex from 'vuex'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        themeColor: colors.green.base,
        snackBarOpen: false,
        snackBarText: ''
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
        }
    },
    actions: {},
    modules: {}
})
