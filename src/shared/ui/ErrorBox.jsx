import { Button } from "./Button"
import { Icon } from "./Icon"
import "./ErrorBox.css"

export function ErrorBox({ message, onRetry }) {
    return (
        <div className="error-box" role="alert">
            <Icon name="alert" size={28} />
            <p>{message ?? "Что-то пошло не так"}</p>
            {onRetry && <Button variant="secondary" onClick={onRetry}>Повторить</Button>}
        </div>
    )
}
