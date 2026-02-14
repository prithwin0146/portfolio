import ScrambleText from '../ScrambleText';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  number: string;
  title: string;
  accent: string;
  visible: boolean;
}

export default function SectionHeader({ number, title, accent, visible }: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${visible ? styles.visible : ''}`}>
      <div className={styles.numberRow}>
        <span className={styles.number} data-mono>{number}</span>
        <span className={styles.line} />
      </div>
      <h2 className={styles.heading}>
        <ScrambleText trigger={visible}>{title}</ScrambleText>
        <ScrambleText trigger={visible} className={styles.accent}>{accent}</ScrambleText>
      </h2>
    </div>
  );
}
