import React from 'react'

const PagesLimit = ({ routeName, history }) => {
    const qs = new URLSearchParams(history.location.search)

    const setPagesLimit = (e) => {
        qs.set('limit', e.target.value)
        for (const [param, value] of qs) if (value === '') qs.delete(param)
        const queryString = `?${qs.toString()}`
        history.push(`/${routeName}${(queryString !== '?' ? queryString : '')}`)
    }

    return (
        <select onChange={setPagesLimit} defaultValue={qs.get('limit') || "20"}>
            <option>1</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
        </select>
    )
}

export default PagesLimit
