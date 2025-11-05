import { Bounce, Slide , toast} from "react-toastify"

export const showToast = (type, message) => {
    let options = {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
    }
    switch (type) {
        case 'info':
            toast.info(message, options)
            break
        case 'success':
            toast.success(message, options)
            break
        case 'warning':
            toast.warning(message, options)
            break
        case 'error':
            toast.error(message, options)
            break
        default:
            toast(message, options)
            break
    }
}

