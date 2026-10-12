import { lazy, Suspense } from 'react';
import Site from './Site.jsx';

/**
 * The admin bundle is large-ish and almost never needed, so it is code-split
 * and only fetched when the URL actually points at /admin.
 *
 * Routing is a pathname check rather than a router dependency — there are only
 * two routes and this keeps the public bundle free of any routing code.
 */
const Admin = lazy(() => import('./pages/Admin.jsx'));

const isAdmin = () => typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

export default function App() {
  if (isAdmin()) {
    return (
      <Suspense fallback={<div className="boot" aria-busy="true" aria-label="Loading admin" />}>
        <Admin />
      </Suspense>
    );
  }

  return <Site />;
}
