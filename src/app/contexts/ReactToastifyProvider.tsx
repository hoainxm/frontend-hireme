import React, { Fragment } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, ToastContainer } from 'react-toastify';

type Props = {
  children: React.ReactNode;
};

export const ReactToastifyProvider = ({ children }: Props) => {
  return (
    <Fragment>
      <ToastContainer
        position='top-right'
        autoClose={4000}
        limit={6}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        transition={Bounce}
      />
      {children}
    </Fragment>
  );
};
