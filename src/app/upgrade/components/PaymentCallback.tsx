import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const PaymentCallback: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('vnp_TransactionStatus');

    if (status === '00') {
      // Giao dịch thành công
      history.push('/upgrade-success'); // Điều hướng đến trang thành công
    } else {
      // Giao dịch thất bại
      history.push('/upgrade-failure'); // Điều hướng đến trang thất bại
    }
  }, [history]);

  return (
    <div>
      <h1>Đang xử lý giao dịch...</h1>
    </div>
  );
};

export default PaymentCallback;
