import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Accordion.module.scss';

interface AccordionProps {
  title: string;
  content: string;
}

export function Accordion({ title, content }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.accordion} ${isOpen ? styles.open : ''}`}>
      <button
        type="button"
        className={styles.title}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.text}>{title}</span>
        <span className={styles.icon}>
          <ChevronDown size={20} strokeWidth={1.75} aria-hidden="true" />
        </span>
      </button>

      <div className={styles.panel} inert={!isOpen}>
        <div className={styles.inner}>
          <p className={styles.content}>{content}</p>
        </div>
      </div>
    </div>
  );
}
