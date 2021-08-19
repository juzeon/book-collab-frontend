let appConfig = {
    baseUrl: process.env.VUE_APP_BASE_URL,
    defaultCoverImg: process.env.VUE_APP_DEFAULT_COVER_IMG
}
let userConfig = {
    defConfig: {
        readingFontSize: 17,
        readingLinePadding: 10,
        readingMdBlockTaken: 6,
        listingSingleColumn: false,
        listingPerPage: 20,
        listingGoToTopAfterPageChange: true
    },
    set(key, value) {
        if (!(key in this.defConfig)) {
            throw new Error(key + ' doesn\'t exist.')
        }
        let storedConfig = localStorage.getItem('book_collab_config')
        let config
        if (!storedConfig) {
            localStorage.setItem('book_collab_config', JSON.stringify(this.defConfig))
            config = this.defConfig
        } else {
            config = JSON.parse(storedConfig)
        }
        config[key] = value
        localStorage.setItem('book_collab_config', JSON.stringify(config))
    },
    get(key) {
        if (!(key in this.defConfig)) {
            throw new Error(key + ' doesn\'t exist.')
        }
        let storedConfig = localStorage.getItem('book_collab_config')
        let config
        if (!storedConfig) {
            localStorage.setItem('book_collab_config', JSON.stringify(this.defConfig))
            config = this.defConfig
        } else {
            config = JSON.parse(storedConfig)
        }
        if (config[key] === undefined || config[key] === null) {
            this.set(key, this.defConfig[key])
            return this.defConfig[key]
        } else {
            return config[key]
        }
    }
}

export {appConfig, userConfig}
