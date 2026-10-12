import "./Loader.css"

// text необязателен: если не передан, подставится значение по умолчанию
export function Loader({text = 'Загрузка...'}){
    return(
        <p className="loader" role="status">
            <span className="loader__spinner" aria-hidden="true"></span>
            {text}
        </p>
    )
}
