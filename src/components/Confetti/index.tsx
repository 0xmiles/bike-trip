import React, { useMemo } from 'react';

import { randomNumber } from 'utils';

import styles from './confetti.module.scss';

const COLORS = ['#e5383b', '#ffb703', '#2a9d8f', '#ffd45e', '#fbf0d9'];
const COUNT = 44;

interface Props {
  show: boolean;
}

const Confetti: React.FC<Props> = ({ show }) => {
  // show 가 바뀔 때마다 새 조각 배치 (마운트 시 1회 계산이지만 키로 리마운트)
  const pieces = useMemo(
    () =>
      Array.from({ length: COUNT }).map(() => ({
        left: randomNumber(0, 100),
        delay: randomNumber(0, 600) / 1000,
        duration: randomNumber(2200, 3600) / 1000,
        rotate: randomNumber(0, 360),
        color: COLORS[randomNumber(0, COLORS.length - 1)],
        size: randomNumber(7, 13),
        round: randomNumber(0, 1) === 1,
      })),
    [],
  );

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (!show || reduced) {
    return null;
  }

  return (
    <div className={styles.wrapper} aria-hidden>
      {pieces.map((p, i) => {
        const style: React.CSSProperties = {
          left: `${p.left}%`,
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          borderRadius: p.round ? '50%' : '2px',
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
        };
        (style as Record<string, string | number>)['--rot'] = `${p.rotate}deg`;
        return <span className={styles.piece} key={i} style={style} />;
      })}
    </div>
  );
};

export default Confetti;
