import "./Button.css"

export function Button({children, onClick, type = 'button', disabled = false, variant = 'primary'}){
    return(
        <button className={`btn btn--${variant}`} type = {type} onClick={onClick}
        disabled={disabled}>{children}</button>
    )
}
