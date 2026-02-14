import styles from './Marquee.module.css';

const items = [
  'WEB DESIGN',
  'FULL-STACK DEV',
  'UI / UX',
  'REACT',
  'ANGULAR',
  '.NET CORE',
  'RESPONSIVE',
  'SEO OPTIMIZED',
  'PERFORMANCE',
  'MODERN STACK',
];

export default function Marquee() {
  const content = items.map((t) => `${t} ✦`).join('  ');

  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        <span className={styles.content}>{content}&nbsp;&nbsp;</span>
        <span className={styles.content} aria-hidden>{content}&nbsp;&nbsp;</span>
      </div>
    </div>
  );
}
