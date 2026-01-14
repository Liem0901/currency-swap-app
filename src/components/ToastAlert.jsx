import Swal from 'sweetalert2'

/**
 * Shows a success toast notification for currency swap
 * @param {string} fromAmount - Amount being swapped from
 * @param {string} fromToken - Token being swapped from
 * @param {string} toAmount - Amount being swapped to
 * @param {string} toToken - Token being swapped to
 */
export const showSwapSuccessToast = (fromAmount, fromToken, toAmount, toToken) => {
    Swal.fire({
        title: 'Swap Successful!',
        text: `${fromAmount} ${fromToken} → ${toAmount} ${toToken}`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    })
}

/**
 * Shows an error toast notification
 * @param {string} message - Error message to display
 */
export const showErrorToast = (message) => {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    })
}

/**
 * Shows an info toast notification
 * @param {string} message - Info message to display
 */
export const showInfoToast = (message) => {
    Swal.fire({
        title: 'Info',
        text: message,
        icon: 'info',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    })
}
