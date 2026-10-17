import { Link } from 'react-router-dom';
import logo from '../../../assets/img/mahlzeit-logo-positiv.svg';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <Link to="/">
        <img className={styles.logo} src={logo} alt="Logo Mahlzeit" />
      </Link>
    </header>
  );
}
