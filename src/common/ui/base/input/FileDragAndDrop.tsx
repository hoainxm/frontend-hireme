import React, { DragEvent, FC, InputHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { verifyUploadData } from '../../../utils/common';
import { Alert } from '../../../utils/popup';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  onFileDropped?: (e: DragEvent<HTMLDivElement>) => void;
  extsAccept?: Array<string>;
  disabled?: boolean;
}

export const FileDragAndDrop: FC<Props> = (props: Props) => {
  const { extsAccept, onFileDropped, disabled = false } = props;
  const { t } = useTranslation();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();

    if (extsAccept) {
      if (verifyUploadData(e.dataTransfer.files, extsAccept)) {
        onFileDropped && onFileDropped(e);
      } else {
        Alert.error({
          title: 'Oops!',
          content: t('upload.error.supportFileType') + extsAccept.join(', '),
        });
      }
    } else {
      onFileDropped && onFileDropped(e);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={props.className} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
      {props.children}
    </div>
  );
};
