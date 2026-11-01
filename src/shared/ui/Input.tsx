import type { InputHTMLAttributes } from 'react'
import './Input.css'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: string
    onChange: (value: string) => void
}

export function Input({value, onChange, ...rest}: InputProps){
    return(
        <input className="input" onChange={(event) => onChange(event.target.value)}
        value={value} {...rest}></input>
    )
}
