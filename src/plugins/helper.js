import Swal from 'sweetalert2'

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
    showServerError(){
        this.alert.error('与伺服器连线时发生错误')
    }
    detectShowServerError(res) {
        if (!res.data.status) {
            this.showServerError()
            return true
        }
        return false
    }
}
