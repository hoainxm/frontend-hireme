/** @format */

import React, { FC, HTMLAttributes, ReactNode } from "react";
import { Container } from "react-bootstrap";
import { PageName } from "../../../../models/enum";
import style from "./content.module.scss";
import { useHistory } from "react-router-dom";
import MainLayout from "../main-layout";
import { SVGIcon } from "../../assets/icon";

interface Props extends HTMLAttributes<HTMLElement> {
  btnGroup?: ReactNode;
  dropDefaultContent?: boolean;
  backTo?: string;
  activate: PageName;
  title?: string;
  backgroundClass?: string;
  hasTabs?: boolean;
  btnGroupClass?: string;
}

const ContentLayout: FC<Props> = (props: Props) => {
  const history = useHistory();
  const {
    dropDefaultContent = false,
    backTo,
    activate,
    title,
    hasTabs = false,
  } = props;

  return (
    <MainLayout active={activate}>
      <Container className={` ${style.contentLayout} ${props.className}`}>
        <div className={style.header}>
          <div className={style.title}>
            {backTo && (
              <SVGIcon
                icon="PreviousPage"
                className="mr-2"
                onClick={() => 
                  hasTabs ? history.push(backTo) : history.goBack()
                }
              />
            )}
            <h1>{title}</h1>
          </div>
          <div className={`${style.btn} ${props.btnGroupClass}`}>
            {props.btnGroup}
          </div>
        </div>

        <div>
          {dropDefaultContent ? (
            <div className={style.padd}>
              <div>{props.children}</div>
            </div>
          ) : (
            <div className={`${style.content} ${props.backgroundClass}`}>
              <div>{props.children}</div>
            </div>
          )}
        </div>
      </Container>
    </MainLayout>
  );
};

export default ContentLayout;
