export default dispatch => {
    return {
        pushToast: (text, color = 'info', displayTime = 7000) => {
            dispatch({
                type: 'toastPush',
                text,
                color,
                displayTime
            })
        },
        removeToast: (index) => {
            dispatch({
                type: 'toastRemove',
                index
            })
        }
    }
}
