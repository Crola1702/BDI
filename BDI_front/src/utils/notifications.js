import { toast } from "react-toastify";

const toastConfig = {
    pauseOnFocusLoss: false,
    pauseOnHover: false
}

function notifySuccess(message) {
    toast.success(message, toastConfig);
}

function notifyError(message) {
    toast.error(message, toastConfig);
}

export { notifySuccess, notifyError };