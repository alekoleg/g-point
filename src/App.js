import React, { useContext, useReducer } from 'react'
import { BrowserRouter as Router} from "react-router-dom"
import Header from './components/Header.js'
import Routes from './routes/Routes'
import Context from './store/Context'
import { Toastr, toastrReducer, toastrActions } from './containers/Toastr'
import initialState from './initialState'
import config from './config'
import api from './api'

const App = () => {
    const [state, dispatch] = useReducer(toastrReducer, useContext(Context) || initialState)

    return (
        <Context.Provider value={{...state, ...config, api, actions: toastrActions(dispatch)}}>
            <Router>
                <Header />
                <Routes />
                <Toastr />
            </Router>
        </Context.Provider>
    )
}

export default App
