import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
  handleConfirm: (func: () => void) => void;
}

const useBlockHistory = (props: Props) => {
  const history = useHistory();
  const isBlockHistoryRef = useRef({
    isBlock: true,
  });

  useEffect(() => {
    window.onbeforeunload = (event) => {
      if (isBlockHistoryRef.current.isBlock) {
        event.returnValue = true;
        event.preventDefault();
      }
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    const unblock = history.block((tx) => {
      const confirmLeave = () => {
        unblock();
        history.push(tx.pathname);
      };
      if (!isBlockHistoryRef.current.isBlock) confirmLeave();
      else props.handleConfirm(confirmLeave);

      return false;
    });
  }, [history]);

  return {
    history,
    blockHistory: isBlockHistoryRef.current,
  };
};

export default useBlockHistory;
