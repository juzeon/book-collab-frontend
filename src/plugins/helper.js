import Swal from 'sweetalert2'
import {appConfig} from "@/plugins/config"
import {appAxios} from "@/plugins/appAxios"

export class Helper {
    alert = {
        success(text) {
            Swal.fire({
                title: '成功',
                text: text,
                icon: 'success'
            })
        },
        error(text) {
            Swal.fire({
                title: '错误',
                text: text,
                icon: 'error'
            })
        }
    }

    showServerError() {
        this.alert.error('与伺服器连线时发生错误')
    }

    detectShowServerError(res) {
        if (!res.data.status) {
            this.showServerError()
            return true
        }
        return false
    }

    getCoverImg() {
        return appConfig.defaultCoverImg
    }

    tagsToTagArr(tags) {
        return tags.split(',').filter(value => value.length)
    }

    tagArrToTags(tagArr) {
        return tagArr.join(',')
    }

    transNumber(number) {
        let decimalDigit = 2
        let integer = Math.floor(number)
        let digit = this._getDigit(integer)
        // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
        let unit = []
        if (digit > 3) {
            let multiple = Math.floor(digit / 8)
            if (multiple >= 1) {
                let tmp = Math.round(integer / Math.pow(10, 8 * multiple))
                unit.push(this._addWan(tmp, number, 8 * multiple, decimalDigit))
                for (let i = 0; i < multiple; i++) {
                    unit.push('亿')
                }
                return unit.join('')
            } else {
                return this._addWan(integer, number, 0, decimalDigit)
            }
        } else {
            return number
        }
    }

    _addWan(integer, number, mutiple, decimalDigit) {
        let digit = this._getDigit(integer)
        if (digit > 3) {
            let remainder = digit % 8
            if (remainder >= 5) {   // ‘十万’、‘百万’、‘千万’显示为‘万’
                remainder = 4
            }
            return Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) / Math.pow(10, decimalDigit) + '万'
        } else {
            return Math.round(number / Math.pow(10, mutiple - decimalDigit)) / Math.pow(10, decimalDigit)
        }
    }

    _getDigit(integer) {
        let digit = -1
        while (integer >= 1) {
            digit++
            integer = integer / 10
        }
        return digit
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
    }
}
