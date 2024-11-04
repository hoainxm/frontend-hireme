import React, { FC } from 'react';
import { useParams } from 'react-router';
// import HTTP404 from '../../../../app/404';
import { APP_ROUTE } from '../../../../routers/constant';

interface Props {}

type Params = {
  process: string;
  program: string;
  feature: string;
};

export const ProductLayout: FC<Props> = () => {
  const { process, program, feature } = useParams<Params>();
  const componentKey = `/${process}/${program}/${feature}`;
  const identifiedComponent = APP_ROUTE.find((r) => r.path === componentKey);

  if (!identifiedComponent) {
    return <div className='position-relative vh-100'>{/* <HTTP404 /> */}</div>;
  }

  const Component = identifiedComponent.component;
  return <Component />;
};
