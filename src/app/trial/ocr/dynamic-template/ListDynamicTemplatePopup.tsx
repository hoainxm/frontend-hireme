import React, { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { SVGIcon } from '@icon/index';
import { ButtonSize, ButtonVariant, DocumentType, PageURL, Palette } from '@models/enum';
import { Form, Image, Modal, ModalBody } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import style from './dynamicTemplate.module.scss';
import CButton from '@base/button';
import CTable from '@base/table';
import { BlankFrame, CTPageSize, CTPaging, CTRow, Loading } from '@base/index';
import Trash from '@icon/TrashBin.svg';
import Empty from '@icon/Empty.svg';
import Edit from '@icon/EditBlue.svg';
import { ITemplate } from 'app/trial/model';
import { useHistory } from 'react-router-dom';
import { Alert } from '../../../../common/utils/popup';
import { RootState } from '@models/rootReducer';
import { useSelector } from 'react-redux';
import { getDynamicTemplateListAPI } from '../../api';
import { APIResponse } from 'common/utils/baseAPI';
import SearchBar from '@base/search';
import { CSSelect, CSelect } from '@base/select';
import Plus from '@icon/Add.svg';
import PlusGray from '@icon/AddGray.svg';
import useSort from '@base/table/sort/useSort';
import { compareDate } from '../../../../common/utils/common';
import Sort from '@base/table/sort';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleChooseTemplate: (template: ITemplate) => void;
  handleDeleteTemplate: (template: ITemplate) => void;
}

export const ListDynamicTemplatePopup: FC<Props> = (props: Props) => {
  const { isOpen, setIsOpen } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = useSelector((state: RootState) => state.main.userInfo?.tenant);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<ITemplate>();
  const [templates, setTemplates] = useState<Array<ITemplate>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);
  const searchValue = useRef<string>('');
  const documentType = useRef<string>('');

  const toggle = () => setIsOpen((prev) => !prev);

  const sort = useSort({
    dataSort: templates,
    fieldMapHandleSort: {
      created_time: (a: ITemplate, b: ITemplate) => compareDate(a.created_time, b.created_time),
    },
  });

  const TABLE_HEADER = [
    '',
    t('field.numeric'),
    '',
    t('type'),
    t('product.ocr.templateName'),
    <>
      {t('timeCreate')}
      <Sort {...sort.checkSortProps('created_time')} />
    </>,
    t('field.action'),
  ];

  const MAP_TITLE_DOCUMENT_TYPE = {
    [DocumentType.LCD]: t('product.ocr.type.lcd'),
    [DocumentType.PAPER]: t('product.ocr.type.paper'),
  };

  const getDynamicTemplates = (page: number, tenantId: string, page_size = pageSize) => {
    setIsLoading(true);
    getDynamicTemplateListAPI(page, tenantId, page_size, searchValue.current, documentType.current)
      .then((res) => {
        const data: APIResponse<ITemplate> = res.data;
        setTemplates(data.results);
        setCurrentPage(data.page);
        setTotalPage(Math.ceil(data.total / data.page_size));
        setTotalData(data.total);
      })
      .catch((error) => {
        Alert.error({ title: 'Oops!', content: t('error.stWrong') });
      })
      .finally(() => setIsLoading(false));
  };

  const onChangePageSize = (event: any) => {
    const { value } = event.target;
    setPageSize(parseInt(value));
    tenantId && getDynamicTemplates(1, tenantId, value);
  };

  const handleSubmitTemplate = () => {
    toggle();
    handleReset();
    selected && props.handleChooseTemplate(selected);
  };
  
  const handleReset = () => {
    setSelected(undefined);
    documentType.current = '';
    searchValue.current = '';
  }

  useEffect(() => {
    if (tenantId && isOpen) getDynamicTemplates(1, tenantId);
    if (!isOpen) handleReset()
  }, [tenantId, isOpen]);

  return (
    <Modal show={isOpen} centered onHide={toggle} dialogClassName={style.modalContainer}>
      <ModalBody className={style.modalBody}>
        <div className={style.modalHeader}>
          <h4 className={style.modalHeaderTitle}>{t('product.ocr.templateList')}</h4>
          <SVGIcon icon='Close' size={24} color={Palette.BLACK} onClick={toggle} />
        </div>
        <div className={style.modalContent}>
          <div className={style.actionBar}>
            <SearchBar
              searchValueListener={searchValue.current}
              placeholder={t('hint.searchTemplate')}
              onSearch={(value) => {
                searchValue.current = value;
                tenantId && getDynamicTemplates(1, tenantId);
              }}
            />
            <CSSelect
              placeholder={t('product.ocr.filterByTemplate')}
              onChangeSelect={(item) => {
                documentType.current = item.value;
                tenantId && getDynamicTemplates(1, tenantId);
              }}
            >
              {Object.entries(MAP_TITLE_DOCUMENT_TYPE).map(([key, value]) => (
                <option key={key} value={key} title={value}>
                  {value}
                </option>
              ))}
            </CSSelect>
            <div className={style.space}></div>
            <CButton
              disabled={templates.length >= 5}
              variant={ButtonVariant.OUTLINE}
              onClick={() => history.push(PageURL.OCR_DYNAMIC_TEMPLATE_CREATE)}
            >
              <Image className='mr-2' src={templates.length < 5 ? Plus : PlusGray} />
              {t('product.ocr.createTemplate')}
            </CButton>
          </div>
          <CTable responsive maxHeight={650}>
            <thead>
              <CTRow header data={TABLE_HEADER} />
            </thead>
            <tbody>
              {templates.map((item, index) => (
                <CTRow
                  key={index}
                  data={[
                    <Form.Check onChange={(e) => setSelected(item)} custom type='radio' name='other-template' id={`radio-template-${index}`} />,
                    index + 1,
                    <Image className={style.image} src={item.template_image} />,
                    MAP_TITLE_DOCUMENT_TYPE[item.document_type],
                    item.template_name,
                    item.created_time,
                    <div className={style.action}>
                      <Image src={Edit} onClick={() => history.push({ pathname: PageURL.OCR_DYNAMIC_TEMPLATE_UPDATE, state: item })} />
                      <Image
                        className={style.removeBtn}
                        src={Trash}
                        onClick={() => {
                          props.handleDeleteTemplate(item);
                          setIsOpen(false);
                        }}
                      />
                    </div>,
                  ]}
                />
              ))}
            </tbody>
          </CTable>
          {templates.length > 0 ? (
            <div className='d-flex justify-content-between align-items-center mt-3'>
              <div>
                <CTPageSize onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
              </div>
              <div>
                <CTPaging currentPage={currentPage} totalPage={totalPage} onGetData={getDynamicTemplates} />
              </div>
            </div>
          ) : (
            <div className={style.blankData}>
              <BlankFrame image={Empty} title={t('field.hint.no_data')} />
            </div>
          )}
          <Loading isOpen={isLoading} />
          <div className={style.modalFooter}>
            <CButton size={ButtonSize.LARGE} className={style.btnGotIt} label={t('btn.confirm')} onClick={handleSubmitTemplate} />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
