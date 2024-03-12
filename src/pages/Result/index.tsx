import React, { useState } from 'react';

import { Button, Loading } from 'components/Common';
import type { BikeData } from 'interface/bikeData.interface';
import { useNavigate } from 'react-router-dom';
import { randomNumber } from 'utils';
import * as xlsx from 'xlsx';

import styles from './result.module.scss';

const Result: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSuccess = Boolean(data) && isLoading;

  const onGetFile = async () => {
    fetch('defend.xlsx', {})
      .then((data) => data.arrayBuffer())
      .then((data) => {
        const excelFile = xlsx.read(data, {
          type: 'binary',
        }) as any;

        const sheetName = excelFile.SheetNames[0];

        const firstSheet = excelFile.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json<BikeData>(firstSheet, {
          defval: '',
        });

        const target = jsonData[randomNumber(0, jsonData.length - 1)];
        setData(target);
      });
  };
  console.log(data);
  const onClickReset = () => {
    navigate(0);
  };

  React.useEffect(() => {
    onGetFile();
    setTimeout(() => {
      setIsLoading(true);
    }, 3000);
  }, []);

  if (!isSuccess) {
    return <Loading />;
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.result}>
        <h1>오늘의 목적지는?</h1>
        <div className={styles.location}>
          <p>{data?.['__EMPTY_3']}</p>
        </div>
      </div>
      <Button color="secondary" onClick={onClickReset}>
        다시 정하기
      </Button>
    </section>
  );
};
export default Result;
