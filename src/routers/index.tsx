/** @format */

import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRouter from "./AppRouter";
import { Loading } from "../common/ui/base";
import { RootState } from "../models/rootReducer";
import { Spinner } from "react-bootstrap";
import { getSysConfig } from "./slice";

interface Props {}

const Routers: FC<Props> = (props: Props) => {
  // const dispatch = useDispatch();
  // const sysConfig = useSelector((state: RootState) => state.sys.sysConfig);
  // const [isCloud, setIsCloud] = useState<boolean>(false);

  // useEffect(() => {
  //   if (!sysConfig) dispatch(getSysConfig());
  //   // eslint-disable-next-line
  // }, []);

  // useEffect(() => {
  //   sysConfig && setIsCloud(sysConfig.is_cloud);
  // }, [sysConfig]);

  return (
    <AppRouter />
    // <>
    //   {sysConfig && isCloud ? (
    //     <AppRouter />
    //   ) : (
    //     <Loading isOpen spinnerSize={50} borderWidth={7}>
    //       Loading...
    //     </Loading>
    //   )}
    // </>
  );
};

export default Routers;
