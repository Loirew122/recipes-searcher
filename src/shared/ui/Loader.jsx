// text необязателен: если не передан, подставится значение по умолчанию
export function Loader({text = 'Загрузка...'}){
    return(
        <p>{text}</p>
    )
}
