let appConfig = {
    baseUrl: process.env.VUE_APP_BASE_URL,
    defaultCoverImg: process.env.VUE_APP_DEFAULT_COVER_IMG
}
let userConfig = {
    defConfig: {
        readingFontSize: 17,
        readingLinePadding: 10
    },
    set(key, value) {
        if(!(key in this.defConfig)){
            throw new Error(key+' doesn\'t exist.')
        }
        localStorage.setItem(key, value)
    },
    get(key) {
        if(!(key in this.defConfig)){
            throw new Error(key+' doesn\'t exist.')
        }
        let lsItem = localStorage.getItem(key)
        console.log('get '+key+' '+lsItem)
        if (lsItem === undefined || lsItem === null) {
            return this.defConfig[key]
        } else {
            return lsItem
        }
    }
}

export {appConfig, userConfig}
