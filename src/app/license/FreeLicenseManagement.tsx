import { Alert, Confirm } from '../../common/utils/popup';
import { BlankFrame, CTPageSize, CTPaging, CTRow, Loading } from '@base/index';
import { FEATURE_NAME_MAPPING, NOT_SET } from '../../common/utils/constants';
import { Overlay, Tooltip } from 'react-bootstrap';
import React, { FC, HTMLAttributes, createRef, useEffect, useState } from 'react';
import { getLicense, renewLicense } from './api';

import { APIResponse } from '../../common/utils/baseAPI';
import CTable from '@base/table';
import { License } from './model';
import { Palette } from '@models/enum';
import { SVGIcon } from '../../common/ui/assets/icon';
import { copyToClipboard } from '../../common/utils/common';
import style from './license.module.scss';
import { useTranslation } from 'react-i18next';

interface Props extends HTMLAttributes<HTMLElement> {
  key: number;
}

export const FreeLicenseManagement: FC<Props> = (props) => {
  const { t } = useTranslation();

  const TABLE_HEADER = [
    t('field.numeric'),
    t('field.featureType'),
    t('field.activationDate'),
    'API Key',
    t('field.remaining'),
    t('field.total'),
    t('field.action'),
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedApiKey, setCopiedApiKey] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);
  const [licenses, setLicenses] = useState<Array<License & { target: React.RefObject<HTMLDivElement> }>>([]);

  const onChangePageSize = (event: any) => {
    const { value } = event.target;
    setPageSize(parseInt(value));
  };

  const copyApiKey = (apiKey: string) => {
    copyToClipboard(apiKey);
    setCopiedApiKey(apiKey);
    setTimeout(() => setCopiedApiKey(''), 800);
  };

  const getUserLicense = (page: number) => {
    setIsLoading(true);
    getLicense({ page, page_size: pageSize, license_type: 0 })
      .then((res) => {
        setIsLoading(false);
        const data: APIResponse<License> = res.data;
        setLicenses(data.results.map((result) => ({ ...result, target: createRef() })));
        setCurrentPage(data.page);
        setTotalPage(Math.ceil(data.total / data.page_size));
        setTotalData(data.total);
      })
      .catch((error) => {
        Alert.error({ title: 'Oops!', content: t('error.stWrong') });
      })
      .finally(() => setIsLoading(false));
  };

  const renewUserLicense = (apiKey: string) => {
    setIsLoading(true);
    renewLicense(apiKey)
      .then((res) => {
        Alert.success({ title: t('sucess.title'), content: t('action.success') });
        getUserLicense(1);
      })
      .catch((error) => {
        Alert.error({ title: 'Oops!', content: t('error.stWrong') });
      })
      .finally(() => setIsLoading(false));
  };

  const confirmResetAPIKey = (apiKey: string) => {
    Confirm.info({
      title: t('cfm.resetApiKey.title'),
      content: t('cfm.resetApiKey.content'),
      labelBtnCfm: t('btn.reset'),
      onConfirm: () => renewUserLicense(apiKey),
    });
  };

  useEffect(() => {
    getUserLicense(1);
  }, [pageSize]);

  return (
    <div className='position-relative'>
      <CTable responsive>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {licenses.length > 0 &&
            licenses.map((item, index) => (
              <CTRow
                key={index}
                data={[
                  index + 1,
                  <p>{item.ai_feature ? t(FEATURE_NAME_MAPPING[item.ai_feature.id]) : NOT_SET}</p>,
                  item.created_at,
                  <div className={style.cellApiKey}>
                    <p>{item.id.length > 6 ? `${item.id.slice(0, 6)}****` : NOT_SET}</p>
                    <div className={style.actionApiKey}>
                      <div id={item.id} ref={item.target} onClick={() => item.id.length > 6 && copyApiKey(item.id)}>
                        <SVGIcon
                          icon='Copy'
                          size={20}
                          color={item.id.length > 6 ? Palette.BLUE : Palette.FIRST_GRAY}
                          className={`${style.btn} ${item.id.length < 6 && style.disabled}`}
                        />
                      </div>
                      {item.target && (
                        <Overlay placement='top' show={copiedApiKey === item.id} target={item.target.current}>
                          {(props) => (
                            <Tooltip id='copyTooltip' {...props}>
                              {t('field.status.copied')}
                            </Tooltip>
                          )}
                        </Overlay>
                      )}
                      <div className={style.line} />
                      <SVGIcon
                        icon='Sync'
                        size={20}
                        color={item.id.length > 6 ? Palette.RED : Palette.FIRST_GRAY}
                        className={`${style.btn} ${item.id.length < 6 && style.disabled}`}
                        onClick={() => item.id.length > 6 && confirmResetAPIKey(item.id)}
                      />
                    </div>
                  </div>,
                  item.request_limit - item.total_used,
                  item.request_limit,
                  NOT_SET
                  // <p className={style.cellAction}>{t('upgrade')}</p>,
                ]}
              />
            ))}
        </tbody>
      </CTable>
      {licenses.length > 0 ? (
        <div className='d-flex justify-content-between align-items-center mt-3'>
          <div>
            <CTPageSize onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging currentPage={currentPage} totalPage={totalPage} onGetData={getUserLicense} />
          </div>
        </div>
      ) : (
        <BlankFrame className='blank-frame' title={t('field.hint.no_data')} />
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};
