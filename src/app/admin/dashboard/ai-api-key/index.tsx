/** @format */

import { AI_FEATURE_TRANSLATE, NOT_SET, PURCHASED_LICENSE, TRIAL_LICENSE } from '../../../../common/utils/constants';
import { Alert, Confirm } from '../../../../common/utils/popup';
import { BlankFrame, CButton, CTPageSize, CTPaging, CTRow, CTable, Loading } from '../../../../common/ui/base';
import { Color, PageURL } from '../../../../models/enum';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { copyToClipboard, handleErrorNoPermission } from '../../../../common/utils/common';
import { deleteAIAPIKeyAPI, getAIAPIKey, getTenantAPIKey } from '../../../../app/dashboard/api';

import { AIAPIKey } from '../../../../app/dashboard/model';
import APIKeyWriter from '../../../../app/dashboard/api-key-writer/APIKeyWriter';
import { APIResponse } from 'common/utils/baseAPI';
import CBadge from '@base/badge';
import { Image } from 'react-bootstrap';
import Trash from '../../../../common/ui/assets/ic/20px/trash-bin.svg';
import copyIcon from '../../../../common/ui/assets/ic/20px/copy.svg';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  isSysAdminSite?: boolean;
  id: string;
}

const SysAPIKeyManagement: FC<Props> = (props: Props) => {
  const { isSysAdminSite = true } = props;
  const { t } = useTranslation();
  const [apiKeys, setAPIKeys] = useState<Array<AIAPIKey>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedAPIKey, setSelectedAPIKey] = useState<AIAPIKey>();
  const history = useHistory();

  const TABLE_HEADER = [
    'API Key',
    t('field.user'),
    t('field.licenseType'),
    `${t('field.featureType')}/ ${t('ai.package')}`,
    `${t('ai.license.request_limit.remaining')}/${t('field.total.count')}`,
    t('field.user.id'),
    t('field.action'),
  ];

  const LICENSE_TYPE_MAP: { [key: string]: string } = {
    [TRIAL_LICENSE]: t('field.licenseType.trial'),
    [PURCHASED_LICENSE]: t('field.licenseType.purchase'),
  };

  const getAPIKeyByTenant = (page: number) => {
    getTenantAPIKey(page, pageSize)
      .then((res) => {
        setIsLoading(false);
        const data: APIResponse<AIAPIKey> = res.data;
        setAPIKeys(data.results);
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

  const getAllTenantAPIKey = (page: number) => {
    getAIAPIKey(page, pageSize)
      .then((res) => {
        setIsLoading(false);
        const data: APIResponse<AIAPIKey> = res.data;
        setAPIKeys(data.results);
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

  const getAPIKeys = (page: number) => {
    setIsLoading(true);
    isSysAdminSite ? getAllTenantAPIKey(page) : getAPIKeyByTenant(page);
  };

  const onChangePageSize = (event: any) => {
    const { value } = event.target;
    setPageSize(parseInt(value));
  };

  const checkValidPageAfterDelete = () => {
    if (apiKeys.length === 1) return currentPage !== 1 ? currentPage - 1 : 1;
    else return currentPage;
  };

  const onDelete = (e: MouseEvent<HTMLImageElement, globalThis.MouseEvent>, id: string) => {
    Confirm.delete({
      title: t('cfm.deletedPackage.title'),
      content: <>{t('cfm.deletedPackage.content')} ?</>,
      onConfirm: () => {
        deleteAIAPIKeyAPI(id)
          .then(() => {
            Alert.success({ title: t('sucess.title'), content: t('action.success') });
            const validPage = checkValidPageAfterDelete();
            getAPIKeys(validPage);
          })
          .catch((error) => {
            Alert.error({ title: 'Oops!', content: t('error.stWrong') });
          });
      },
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const showAPIKeyWriterPopup = (apiKeyUpdate?: AIAPIKey) => {
    setSelectedAPIKey(apiKeyUpdate);
    setIsOpen(true);
  };

  const handleWriterSuccess = () => {
    setIsOpen(false);
    getAPIKeys(currentPage);
    setSelectedAPIKey(undefined);
    Alert.success({ title: t('sucess.title'), content: t('action.success') });
  };

  const getApiKey = (e: MouseEvent<HTMLImageElement, globalThis.MouseEvent>, value: string) => {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(value);
  };

  const handleCopyCellValue = (value: string) => {
    return (
      <div className='d-flex'>
        {value.slice(0, 4)}***
        <Image className='ml-3' src={copyIcon} width={20} height={20} onClick={(e) => getApiKey(e, value)} />
      </div>
    );
  };

  const renderLicenseType = (licenseType: number | string) => {
    const COLOR: { [key: string]: any } = {
      [TRIAL_LICENSE]: Color.ORANGE,
      [PURCHASED_LICENSE]: Color.SUCCESS,
    };

    return <CBadge ctype={COLOR[licenseType]}>{LICENSE_TYPE_MAP[licenseType]}</CBadge>;
  };

  useEffect(() => {
    getAPIKeys(1);
    // eslint-disable-next-line
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton onClick={() => history.push(`${PageURL.ADMIN_AI_API_KEY}/create`)} className='ml-2' label={t('ai.apikey.add')} />
      </div>
      <APIKeyWriter
        isSysAdminSite={isSysAdminSite}
        isOpen={isOpen}
        toggle={() => {
          setIsOpen(!isOpen);
          setSelectedAPIKey(undefined);
        }}
        onSuccess={handleWriterSuccess}
        initialAPILicense={selectedAPIKey}
      />
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {apiKeys.map((item: AIAPIKey, index) => (
            <CTRow
              onClick={() => showAPIKeyWriterPopup(item)}
              key={index}
              data={[
                item.api_key ? handleCopyCellValue(item.api_key) : NOT_SET,
                item.tenant.alias || NOT_SET,
                renderLicenseType(item.type) || NOT_SET,
                item.package ? item.package.name : item.ai_feature ? t(AI_FEATURE_TRANSLATE[item.ai_feature?.name]) : NOT_SET,
                item.request_limit != undefined ? `${item.request_limit - item.total_used}/${item.request_limit}` : `${NOT_SET}/${NOT_SET}`,
                item.tenant.id ? handleCopyCellValue(item.tenant.id) : NOT_SET,
                <>{isSysAdminSite ? <Image src={Trash} onClick={(e) => onDelete(e, item.id)} /> : NOT_SET}</>,
              ]}
            />
          ))}
        </tbody>
      </CTable>

      {apiKeys.length > 0 ? (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={totalPage} onGetData={getAPIKeys} />
          </div>
        </div>
      ) : (
        <BlankFrame className='blank-frame' title={t('field.hint.no_data')} />
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default SysAPIKeyManagement;
