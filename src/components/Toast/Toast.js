import React, { useContext } from 'react'
import Context from '../../store/Context'
import { ToastStyled } from './'
import { CloseIcon } from '@icons/material'

export default ({ index, text, color, displayTime }) => {
    const state = useContext(Context)

    if (displayTime > 0) {
        setTimeout(() => {
            state.actions.removeToast(index)
        }, displayTime)
    }

    return (
        <ToastStyled style={{backgroundColor: `var(--${color})`}} onClick={() => state.actions.removeToast(index)}>
            <div>{text}</div>
            <CloseIcon />
        </ToastStyled>
    )
}
