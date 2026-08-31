import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    labs: 'Labs',
    logs: 'Live Logs',
    diagnosis: 'AI Diagnosis',
    admin: 'Admin',
    chaos: 'Chaos Control',
    settings: 'Settings',
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-secondary">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-text-primary transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-text-muted" />
        <span>Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[value] || (value.length > 10 ? `#${value.substring(0, 8)}` : value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
            {isLast ? (
              <span className="font-semibold text-text-primary capitalize">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-text-primary transition-colors capitalize">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
