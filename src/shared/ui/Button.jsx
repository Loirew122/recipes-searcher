import "./Button.css"

export function Button({children, onClick, type = 'button', disabled = false, variant = 'primary', className = '', ...rest}){
    return(
        <button className={`btn btn--${variant} ${className}`.trim()} type = {type} onClick={onClick}
        disabled={disabled} {...rest}>{children}</button>
    )
}
