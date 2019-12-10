export default (state, action) => {
    switch (action.type) {
        case 'toastPush':
            state.toasts.push({...action})
            return {
                ...state
            };
        case 'toastRemove':
            delete state.toasts[action.index]
            return {
                ...state
            };
        case 'toastrActions':
            return {
                ...state,
                actions: action.actions
            } 
        default:
            return state;
    }
}
