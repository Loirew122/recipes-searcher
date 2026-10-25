import { Link } from "react-router-dom"
import { EmptyState } from "@shared/ui/EmptyState"

export function NotFoundPage() {
  return (
    <>
      <EmptyState title="Страница не найдена" hint="Такого адреса нет" />
      <Link to="/" className="back-link">На главную</Link>
    </>
  )
}