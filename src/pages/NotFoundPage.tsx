import { Link } from "react-router-dom"
import { EmptyState } from "@shared/ui/EmptyState"

export function NotFoundPage() {
  return (
    <div className="page">
      <EmptyState icon="utensils" title="Страница не найдена" hint="Такого адреса нет — возможно, ссылка устарела">
        <Link to="/" className="btn btn--primary">На главную</Link>
      </EmptyState>
    </div>
  )
}
