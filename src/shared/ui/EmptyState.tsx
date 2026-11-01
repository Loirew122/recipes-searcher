import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import './EmptyState.css'

interface EmptyStateProps {
  title: string
  hint?: string
  icon?: IconName
  children?: ReactNode
}

export function EmptyState({
  title,
  hint,
  icon,
  children,
}: EmptyStateProps) {
  return (
    <div className="empty">
      {icon && (
        <span className="empty__icon">
          <Icon name={icon} size={28} />
        </span>
      )}
      <p className="empty__title">{title}</p>
      {hint && <p className="empty__hint">{hint}</p>}
      {children && <div className="empty__actions">{children}</div>}
    </div>
  )
}
