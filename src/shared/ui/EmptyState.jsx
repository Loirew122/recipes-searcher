import "./EmptyState.css"

export function EmptyState({title, hint}){
    return (
        <div className="empty">
            <p className="empty__title">{title}</p>
            {hint && <p className="empty__hint">{hint}</p>}
        </div>
    )
}
