// title показывается всегда, hint только если его передали
export function EmptyState({title, hint}){
    return (
        <div>
            <p>{title}</p>
            {hint && <p>{hint}</p>}
        </div>
    )
}
