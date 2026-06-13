import React, { useEffect, useMemo, useRef, useState } from 'react';

import { randomNumber, type Station } from 'utils';

import styles from './reel.module.scss';

export const REEL_ITEM_HEIGHT = 76;
const STRIP_LENGTH = 36;
const WIN_INDEX = 31; // 당첨 항목이 멈출 위치 (스트립 끝부분)

interface Props {
  stations: Station[];
  winner: Station | null;
  spinId: number; // 스핀할 때마다 증가 — 릴 재생성 트리거
  spinning: boolean;
  onSettle: () => void;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const Reel: React.FC<Props> = ({
  stations,
  winner,
  spinId,
  spinning,
  onSettle,
}) => {
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(false);
  const rafRef = useRef<number>();
  const settleRef = useRef<() => void>(onSettle);
  settleRef.current = onSettle;
  const settledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // 스핀마다 당첨 항목을 WIN_INDEX 에 고정하고 나머지는 랜덤 채움
  const items = useMemo<Station[]>(() => {
    if (stations.length === 0) {
      return [];
    }
    const strip: Station[] = [];
    for (let i = 0; i < STRIP_LENGTH; i += 1) {
      if (i === WIN_INDEX && winner) {
        strip.push(winner);
      } else {
        strip.push(stations[randomNumber(0, stations.length - 1)]);
      }
    }
    return strip;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinId, stations]);

  const finalOffset = -((WIN_INDEX - 1) * REEL_ITEM_HEIGHT);
  const reduced = prefersReducedMotion();
  const durationMs = reduced ? 400 : 3200;

  const settle = () => {
    if (settledRef.current) {
      return;
    }
    settledRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    navigator.vibrate?.(35);
    settleRef.current();
  };

  useEffect(() => {
    if (!spinning || !winner) {
      return;
    }

    settledRef.current = false;

    // 1) transition 끄고 시작 위치로 리셋
    setAnimate(false);
    setOffset(0);

    // 2) 두 프레임 뒤 transition 켜고 최종 위치로 이동 → 감속 스핀
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setAnimate(true);
        setOffset(finalOffset);
      });
    });

    // transitionend 누락(백그라운드 탭 등) 대비 안전 타이머
    timerRef.current = setTimeout(settle, durationMs + 400);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinId, spinning]);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === 'transform' && spinning) {
      settle();
    }
  };

  const visible = items.length > 0 ? items : stations.slice(0, STRIP_LENGTH);

  return (
    <div className={styles.window} aria-hidden={spinning}>
      <div className={styles.fadeTop} />
      <div className={styles.line}>
        <span className={styles.chevronLeft}>▶</span>
        <span className={styles.chevronRight}>◀</span>
      </div>
      <div
        className={styles.strip}
        style={{
          transform: `translateY(${offset}px)`,
          transition: animate
            ? `transform ${reduced ? 0.4 : 3.2}s cubic-bezier(0.16, 1, 0.3, 1)`
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {visible.map((station, index) => (
          <div
            className={styles.row}
            style={{ height: REEL_ITEM_HEIGHT }}
            key={`${spinId}-${index}`}
          >
            <span className={styles.district}>{station?.district}</span>
            <span className={styles.name}>{station?.name}</span>
          </div>
        ))}
      </div>
      <div className={styles.fadeBottom} />
    </div>
  );
};

export default Reel;
