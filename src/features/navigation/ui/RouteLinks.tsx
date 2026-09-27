import { Link } from '@tanstack/react-router'

export function RouteLinks() {
  return (
    <nav aria-label="Application routes">
      <ul className="route-list">
        <li>
          <Link to="/movies" search={{ offset: 0, limit: 20 }}>
            Movie catalog
          </Link>
        </li>
        <li>
          <Link to="/movies/new">Create movie</Link>
        </li>
        <li>
          <Link to="/movies/$movieId" params={{ movieId: '1' }}>
            Movie details example
          </Link>
        </li>
        <li>
          <Link to="/movies/$movieId/edit" params={{ movieId: '1' }}>
            Edit movie example
          </Link>
        </li>
        <li>
          <Link to="/external-search" search={{ query: 'The Matrix' }}>
            External search example
          </Link>
        </li>
      </ul>
    </nav>
  )
}
