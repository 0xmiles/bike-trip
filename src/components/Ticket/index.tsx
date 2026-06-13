import React, { useState } from 'react';

import { mapUrl, type Station } from 'utils';

import styles from './ticket.module.scss';

interface Props {
  station: Station;
  onReset: () => void;
}

const Ticket: React.FC<Props> = ({ station, onReset }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(station.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.ticket} role="status" aria-live="polite">
      <div className={styles.stub}>
        <span className={styles.stubText}>WINNER</span>
      </div>

      <div className={styles.main}>
        <p className={styles.label}>🎉 오늘의 당첨 행선지</p>
        <span className={styles.district}>{station.district}</span>
        <h2 className={styles.name}>{station.name}</h2>
        <p className={styles.address}>{station.address}</p>

        <div className={styles.actions}>
          <a
            className={styles.mapBtn}
            href={mapUrl(station)}
            target="_blank"
            rel="noreferrer"
          >
            🗺️ 길찾기
          </a>
          <button className={styles.copyBtn} type="button" onClick={onCopy}>
            {copied ? '✅ 복사됨' : '📋 주소 복사'}
          </button>
        </div>

        <button className={styles.reset} type="button" onClick={onReset}>
          🎰 다시 돌리기
        </button>
      </div>
    </div>
  );
};

export default Ticket;
