import type { ComponentProps } from 'react'
import './Input.css'

interface InputProps extends Omit<ComponentProps<'input'>, 'onChange' | 'value'> {
    value: string
    onChange: (value: string) => void
}

export function Input({value, onChange, ...rest}: InputProps){
    return(
        <input className="input" onChange={(event) => onChange(event.target.value)}
        value={value} {...rest}></input>
    )
}
