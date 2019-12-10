import styled from 'styled-components'

const SearchForm = styled.form`
    display: flex;
`

const SearchInput = styled.input`
    border-radius: var(--border-radius) 0 0 var(--border-radius);
    border-right: none;
`

const SearchButton = styled.button`
    display: flex;
    align-items: center;
    padding: 0 1.9rem;
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
`

export {
    SearchForm,
    SearchInput,
    SearchButton
}
