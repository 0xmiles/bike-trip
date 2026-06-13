import { useEffect, useState } from 'react';

import { parseStations, type Station } from 'utils';
import * as xlsx from 'xlsx';

type Status = 'loading' | 'ready' | 'error';

interface UseStations {
  stations: Station[];
  status: Status;
}

export const useStations = (): UseStations => {
  const [stations, setStations] = useState<Station[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let alive = true;

    fetch(`${process.env.PUBLIC_URL}/defend.xlsx`)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = xlsx.read(new Uint8Array(buffer), { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
        const parsed = parseStations(rows as never[]);

        if (alive) {
          setStations(parsed);
          setStatus(parsed.length > 0 ? 'ready' : 'error');
        }
      })
      .catch(() => {
        if (alive) {
          setStatus('error');
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  return { stations, status };
};
