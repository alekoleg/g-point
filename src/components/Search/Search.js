import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { SearchForm, SearchInput, SearchButton } from './Search.styled'
import { MagnifyIcon } from '@icons/material'

const Search = ({ taxonomy, location, history, className, placeholder }) => {
    const qs = new URLSearchParams(location.search)

    const [value, setValue] = useState('')

    const changeSearch = e => {
        setValue(e.target.value)
    }

    const submitSearch = e => {
        qs.set('search', value)
        for (const [param, value] of qs) if (value === '') qs.delete(param)
        const queryString = `?${qs.toString()}`
        history.push(`/${taxonomy}${(queryString !== '?' ? queryString : '')}`)
        e.preventDefault()
    }

    return (
        <SearchForm className={className} action={`/${taxonomy}`} method="get" onSubmit={submitSearch}>
            <SearchInput type="text" name="search" onChange={changeSearch}
                defaultValue="" placeholder={placeholder || 'Поиск по ID или названию...'} size="26" />
            <SearchButton>
                <MagnifyIcon />
            </SearchButton>
        </SearchForm>
    )
}

export default withRouter(Search)
