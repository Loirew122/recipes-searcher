export function Input({value, onChange, placeholder, disabled=false}){
    return(
        <input onChange={(event) => onChange(event.target.value)} placeholder={placeholder}
        disabled ={disabled} value = {value}></input>
    )
}