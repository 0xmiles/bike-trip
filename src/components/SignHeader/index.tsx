import React from 'react';

import styles from './signHeader.module.scss';

const BULBS = Array.from({ length: 14 });

const BulbRow: React.FC = () => (
  <div className={styles.bulbs}>
    {BULBS.map((_, i) => (
      <span
        className={styles.bulb}
        style={{ animationDelay: `${(i % 4) * 0.15}s` }}
        key={i}
      />
    ))}
  </div>
);

const SignHeader: React.FC = () => {
  return (
    <header className={styles.sign}>
      <BulbRow />
      <div className={styles.body}>
        <p className={styles.kicker}>오늘의 따릉이 행선지</p>
        <h1 className={styles.title}>따 랜 디</h1>
        <p className={styles.sub}>따릉이 랜덤 디펜스</p>
      </div>
      <BulbRow />
    </header>
  );
};

export default SignHeader;
