import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './BackLink.module.scss';

interface BackLinkProps {
  fallback: string; // used when the page was opened directly (e.g. shared link)
  className?: string; // extra classes, e.g. for positioning
  children: React.ReactNode;
}

export function BackLink({
  fallback,
  className = '',
  children,
}: BackLinkProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasHistory = location.key !== 'default';

  return (
    <Link
      to={fallback}
      className={`btn btn--link ${styles.backLink} ${className}`}
      onClick={(e) => {
        // Go back in history to keep the previous page's state
        if (hasHistory) {
          e.preventDefault();
          navigate(-1);
        }
      }}
    >
      <ChevronLeft size={16} aria-hidden="true" />
      {children}
    </Link>
  );
}
