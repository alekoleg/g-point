import React, { useContext } from 'react'
import Context from '../../store/Context'
import { ToastrStyled } from './'
import { Toast } from '../../components/Toast'

export default () => {
    const state = useContext(Context)

    return (
        <ToastrStyled>
            {state.toasts.map((toast, key) => (
                <Toast {...toast} key={key} index={key} />
            ))}
        </ToastrStyled>
    )
}
