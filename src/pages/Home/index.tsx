import React, { useEffect, useState } from 'react';

import { LightBallIcon } from 'assets';
import cx from 'clsx';
import { BikeData } from 'interface/bikeData.interface';
import { useNavigate } from 'react-router-dom';
import * as xlsx from 'xlsx';

import styles from './home.module.scss';
import { filterLocation } from './utils';

interface Targets {
  first: string[];
  second: string[];
  third: string[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<boolean>(false);
  // const [rawData, setRawData] = useState<BikeData[]>([]);
  const [data, setData] = useState<[string, string, string]>(['', '', '']);
  const [targets, setTargets] = useState<Targets>({
    first: ['따'],
    second: ['랜'],
    third: ['디'],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isSuccess = Boolean(data) && !isLoading;

  // const onReset = (jsonData: BikeData[]) => {
  //   const { location: rawLocation } =
  //     jsonData[randomNumber(0, jsonData.length - 1)];
  //   const location = filterLocation(rawLocation);
  //   setData([
  //     location[0] || '',
  //     location[1] || '',
  //     location.length > 3 ? location.slice(2).join(',') : location[2] ?? '',
  //   ]);
  // };

  const onClickStick = () => {
    navigate('result');
  };

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
