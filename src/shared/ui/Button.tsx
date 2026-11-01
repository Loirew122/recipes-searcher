import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

type ButtonVariant = 'primary' | 'secondary' | 'fav' | 'ghost' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
}

export function Button({children, type = 'button', variant = 'primary', className = '', ...rest}: ButtonProps){
    return(
        <button className={`btn btn--${variant} ${className}`.trim()} type={type}
        {...rest}>{children}</button>
    )
}
