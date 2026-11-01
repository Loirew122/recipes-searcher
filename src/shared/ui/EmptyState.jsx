import { Icon } from "./Icon"
import "./EmptyState.css"

export function EmptyState({title, hint, icon, children}){
    return (
        <div className="empty">
            {icon && <span className="empty__icon"><Icon name={icon} size={28} /></span>}
            <p className="empty__title">{title}</p>
            {hint && <p className="empty__hint">{hint}</p>}
            {children && <div className="empty__actions">{children}</div>}
        </div>
    )
}
