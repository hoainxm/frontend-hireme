import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const PaymentCallback: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('vnp_TransactionStatus');

    if (status === '00') {
      history.push('/upgrade-success');
    } else {
      history.push('/upgrade-failure');
    }
  }, [history]);

  return (
    <div>
      <h1>Đang xử lý giao dịch...</h1>
    </div>
  );
};

export default PaymentCallback;
