/** @format */

import { Alert, Confirm } from '../../../../common/utils/popup';
import { BlankFrame, CButton, CTPageSize, CTPaging, CTRow, CTable, Loading } from '../../../../common/ui/base';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { doDeleteAIPackage, doGetAIPackage } from '../../../dashboard/api';

import { AIFeaturePackage } from '../../../dashboard/model';
import { APIResponse } from '../../../../common/utils/baseAPI';
import { Image } from 'react-bootstrap';
import { NOT_SET } from '../../../../common/utils/constants';
import { PageURL } from '../../../../models/enum';
import Trash from '../../../../common/ui/assets/ic/20px/trash-bin.svg';
import { handleErrorNoPermission } from '../../../../common/utils/common';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string;
}

const AIPackageManagement: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [packages, setPackages] = useState<Array<AIFeaturePackage>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalData, setTotalData] = useState<number>(0);

  const TABLE_HEADER = [t('field.numeric'), t('field.name'), t('field.createdDate'), t('field.action')];

  const getAIPackage = (page: number) => {
    setIsLoading(true);

    doGetAIPackage(page, pageSize)
      .then((res) => {
        setIsLoading(false);
        const data: APIResponse<AIFeaturePackage> = res.data;
        setPackages(data.results);
        setCurrentPage(data.page);
        setTotalPage(Math.ceil(data.total / data.page_size));
        setTotalData(data.total);
      })
      .catch((error) => {
        if (error.response?.status === 403) handleErrorNoPermission(error, t);
        else Alert.error({ title: 'Oops!', content: t('error.stWrong') });
      })
      .finally(() => setIsLoading(false));
  };

  const onChangePageSize = (event: any) => {
    const { value } = event.target;
    setPageSize(parseInt(value));
  };

  const checkValidPageAfterDelete = () => {
    if (packages.length === 1)
      if (currentPage !== 1) return currentPage - 1;
      else return 1;
    else return currentPage;
  };

  const onDelete = (e: MouseEvent<HTMLImageElement, globalThis.MouseEvent>, id: string) => {
    Confirm.delete({
      title: t('cfm.deletedPackage.title'),
      content: <>{t('cfm.deletedPackage.content')} ?</>,
      onConfirm: () => {
        doDeleteAIPackage(id)
          .then((res) => {
            Alert.success({ title: t('sucess.title'), content: t('action.success') });
            const validPage = checkValidPageAfterDelete();
            getAIPackage(validPage);
          })
          .catch((error) => {
            if (error.response?.data?.package === 'The package is current in use in the API key') {
              Alert.error({ title: 'Oops!', content: t('package.err.inUser') });
            } else Alert.error({ title: 'Oops!', content: t('error.stWrong') });
          });
      },
    });
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    getAIPackage(1);
    // eslint-disable-next-line
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton className='ml-2' label={t('aipackage.management.add')} onClick={() => history.push(`${PageURL.ADMIN_AI_PACKAGE}/create`)} />
      </div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {packages.map((item: AIFeaturePackage, index) => (
            <CTRow
              onClick={() => history.push(`${PageURL.ADMIN_AI_PACKAGE}/update/${item.id}`)}
              key={index}
              data={[
                index + 1,
                item.name || NOT_SET,
                item.created_at ? item.created_at.toString() : NOT_SET,
                <Image src={Trash} onClick={(e) => onDelete(e, item.id)} />,
              ]}
            />
          ))}
        </tbody>
      </CTable>
      {packages.length > 0 ? (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={totalPage} onGetData={getAIPackage} />
          </div>
        </div>
      ) : (
        <BlankFrame className='blank-frame' title={t('field.hint.no_data')} />
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default AIPackageManagement;
