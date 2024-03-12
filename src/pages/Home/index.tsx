import React, { useEffect, useState } from 'react';

import { LightBallIcon } from 'assets';
import cx from 'clsx';
import { BikeData } from 'interface/bikeData.interface';
import { randomNumber } from 'utils';
import * as xlsx from 'xlsx';

import styles from './home.module.scss';
import { filterLocation } from './utils';

interface Targets {
  first: string[];
  second: string[];
  third: string[];
}

const Home: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const [data, setData] = useState<[string, string, string]>(['', '', '']);
  const [targets, setTargets] = useState<Targets>({
    first: ['따'],
    second: ['랜'],
    third: ['디'],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isSuccess = Boolean(data) && !isLoading;

  const onClickStick = () => {
    if (isActive && isLoading) {
      return;
    }
    if (isActive) {
      setIsLoading(true);
      setIsActive(false);
    } else {
      setIsActive(true);

      setTimeout(() => {
        const index = randomNumber(0, targets.first.length - 1);

        setData([
          targets.first[index],
          targets.second[index],
          targets.third[index],
        ]);
        setIsLoading(false);
      }, 2_000);
    }
  };

  useEffect(() => {
    // xlsx.set_fs(fs);
    fetch('defend.xlsx', {})
      .then((data) => data.arrayBuffer())
      .then((data) => {
        const excelFile = xlsx.read(data, {
          type: 'binary',
        }) as any;

        const sheetName = excelFile.SheetNames[0];

        const firstSheet = excelFile.Sheets[sheetName];
        const jsonData = xlsx.utils
          .sheet_to_json<BikeData>(firstSheet, {
            defval: '',
          })
          .map((data: any) => data['__EMPTY_3'] as string);
        jsonData
          .map((data) => filterLocation(data))
          .forEach((location) =>
            setTargets((prev) => {
              return {
                first: [...prev.first, location[0] ?? ''],
                second: [...prev.second, location[1] ?? ''],
                third: [
                  ...prev.third,
                  location.length > 3
                    ? location.slice(2).join(',')
                    : location[2] ?? '',
                ],
              };
            }),
          );
      });
  }, []);

  return (
    <section className={styles.wrapper}>
      <div className={styles.title}>
        <p>
          <span className={styles.highlight}>따</span>
          릉이
        </p>
        <p>
          <span className={styles.highlight}>랜</span>덤
        </p>
        <p>
          <span className={styles.highlight}>디</span>펜스
        </p>
      </div>
      <div className={styles.rolletWrapper}>
        <div className={styles.top}>
          <LightBallIcon />
          <LightBallIcon />
          <LightBallIcon />
        </div>
        <div className={styles.body}>
          <p>따랜디</p>
          <div
            className={cx(styles.rolesWrapper, {
              [styles.isActive]: isActive && !isSuccess,
            })}
          >
            <div className={styles.role}>
              <div className={styles.container}>
                {isSuccess ? (
                  <p className={styles.isSuccess}>{data[0]}</p>
                ) : (
                  targets.first.map((text, index) => <p key={index}>{text}</p>)
                )}
              </div>
            </div>
            <div className={styles.role}>
              <div className={styles.container}>
                {isSuccess ? (
                  <p className={styles.isSuccess}>{data[1]}</p>
                ) : (
                  targets.second.map((text, index) => <p key={index}>{text}</p>)
                )}
              </div>
            </div>
            <div className={styles.role}>
              <div className={styles.container}>
                {isSuccess ? (
                  <p className={styles.isSuccess}>{data[2]}</p>
                ) : (
                  targets.third.map((text, index) => <p key={index}>{text}</p>)
                )}
              </div>
            </div>
          </div>
          <div
            className={cx(styles.stick, { [styles.isActive]: isActive })}
            onClick={onClickStick}
          >
            <div className={styles.handle} />
          </div>
        </div>
        <div className={styles.bottom} />
      </div>
    </section>
  );
};

export default Home;
