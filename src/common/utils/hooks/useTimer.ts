/** @format */

import { useEffect, useState } from "react";

interface Props {
  time: Array<typeof initTimer>;
  callback: () => void;
}

const initTimer = {
  hour: 0,
  minute: 0,
};

const useTimer = (props: Props) => {
  const [time, setTime] = useState(new Date());
  const [canReload, setCanReload] = useState(false);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    props.time.forEach(({ hour, minute }) => {
      if (
        time.getHours() === hour &&
        time.getMinutes() === minute &&
        canReload
      ) {
        props.callback();
      } else setCanReload(true);
    });

    return () => {
      clearInterval(timeInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);
};

export default useTimer;
