import React, { useCallback, useEffect, useRef, useState } from 'react';

import cx from 'clsx';
import { Confetti, Reel, SignHeader, Ticket } from 'components';
import { useStations } from 'hooks/useStations';
import { randomNumber, type Station } from 'utils';

import styles from './home.module.scss';

type Phase = 'idle' | 'spinning' | 'result';

const Home: React.FC = () => {
  const { stations, status } = useStations();

  const [phase, setPhase] = useState<Phase>('idle');
  const [winner, setWinner] = useState<Station | null>(null);
  const [spinId, setSpinId] = useState(0);
  const ticketRef = useRef<HTMLDivElement>(null);

  const spin = useCallback(() => {
    if (status !== 'ready' || phase === 'spinning') {
      return;
    }
    navigator.vibrate?.(20);
    setWinner(stations[randomNumber(0, stations.length - 1)]);
    setSpinId((id) => id + 1);
    setPhase('spinning');
  }, [status, phase, stations]);

  const onSettle = useCallback(() => {
    setPhase('result');
  }, []);

  useEffect(() => {
    if (phase === 'result') {
      ticketRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [phase, spinId]);

  return (
    <section className={styles.wrapper}>
      <Confetti show={phase === 'result'} key={spinId} />

      <SignHeader />

      <div
        className={cx(styles.cabinet, { [styles.live]: phase === 'spinning' })}
      >
        <div className={styles.cabinetTop}>
          <span className={styles.coinSlot} />
          <span className={styles.cabinetLabel}>LUCKY STATION</span>
          <span className={styles.coinSlot} />
        </div>

        <div className={styles.screen}>
          <Reel
            stations={stations}
            winner={winner}
            spinId={spinId}
            spinning={phase === 'spinning'}
            onSettle={onSettle}
          />
        </div>

        <div
          className={cx(styles.lever, {
            [styles.leverDown]: phase === 'spinning',
          })}
        >
          <span className={styles.leverKnob} />
        </div>
      </div>

      {phase !== 'result' && (
        <button
          className={styles.spinBtn}
          type="button"
          onClick={spin}
          disabled={status !== 'ready' || phase === 'spinning'}
        >
          {status === 'loading' && '대여소 불러오는 중…'}
          {status === 'error' && '데이터를 불러오지 못했어요'}
          {status === 'ready' &&
            (phase === 'spinning' ? '🌀 돌리는 중…' : '🎰 돌리기!')}
        </button>
      )}

      <div ref={ticketRef} className={styles.ticketSlot}>
        {phase === 'result' && winner && (
          <Ticket station={winner} onReset={spin} />
        )}
      </div>
    </section>
  );
};

export default Home;
