import ScrambleText from '../ScrambleText';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  number: string;
  title: string;
  accent: string;
  subtitle?: string;
  visible: boolean;
}

export default function SectionHeader({ number, title, accent, subtitle, visible }: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${visible ? styles.visible : ''}`}>
      <div className={styles.numberRow}>
        <span className={styles.number} data-mono>{number}</span>
        <span className={styles.line} />
      </div>
      <h2 className={styles.heading}>
        {title && <ScrambleText trigger={visible}>{title}</ScrambleText>}
        <ScrambleText trigger={visible} className={styles.accent}>{accent}</ScrambleText>
        {subtitle && (
          <span className={styles.subtitle}>
            <ScrambleText trigger={visible}>({subtitle})</ScrambleText>
          </span>
        )}
      </h2>
    </div>
  );
}
