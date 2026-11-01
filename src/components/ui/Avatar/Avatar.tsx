import { CircleUser } from 'lucide-react';
import styles from './Avatar.module.scss';

interface AvatarProps {
  photoURL: string | null;
}

// Profile picture, or a placeholder icon if the user has none
export function Avatar({ photoURL }: AvatarProps) {
  if (photoURL) {
    return <img src={photoURL} alt="Profilbild" className={styles.avatar} />;
  }

  return (
    <span className={`${styles.avatar} ${styles.empty}`}>
      <CircleUser size={40} strokeWidth={1.5} aria-hidden="true" />
    </span>
  );
}
