import "./Loader.css"

// text необязателен: если не передан, подставится значение по умолчанию
interface LoaderProps {
    text?: string
}

export function Loader({text = 'Загрузка...'}: LoaderProps){
    return(
        <p className="loader" role="status">
            <span className="loader__spinner" aria-hidden="true"></span>
            {text}
        </p>
    )
}
