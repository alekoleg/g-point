import styled from 'styled-components'

const Label = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: #ddd;
    border: .1rem solid var(--secondary);
    border-radius: var(--border-radius);
    
    &:focus, &:active {
        color: var(--dark);
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-shadow);
    }
`

export default Label
