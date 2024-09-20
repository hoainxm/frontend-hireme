/** @format */

import React, { FC, ChangeEvent, useEffect, useState, MouseEvent, RefObject, InputHTMLAttributes } from 'react';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import style from './input.module.scss';
import DefaultAvatar from '../../assets/ic/150px/avatar.svg';
import DefaultLogo from '../../assets/ic/120px/defaultLogo.svg';
import DefaultDashed from '../../assets/ic/32px/AddIcon.svg';
import Edit from '../../assets/ic/20px/edit-white.svg';
import { CButton } from '../../base';
import { Alert } from '../../../utils/popup';
import { ImportImageStyle, Palette } from '../../../../models/enum';
import imageCompression from 'browser-image-compression';
import { SVGIcon } from '../../assets/icon';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  defaultImage?: string | null;
  setDefaultImage?: (value: string) => void;
  width: number;
  height: number;
  // register pass from parent useForm()
  register: string | ((instance: HTMLInputElement | null) => void) | RefObject<HTMLInputElement>;
  widthButton?: number;
  heightButton?: number;
  previewImgClassName?: string;
  frameType?: ImportImageStyle;
  handleOnChange?: (val: boolean) => void;
  disabled?: boolean;
  isHide?: boolean;
  setResizedImage?: (image?: File) => void;
}

const ImportImage: FC<Props> = (props: Props) => {
  const {
    defaultImage,
    register,
    className,
    width,
    height,
    name,
    setDefaultImage,
    widthButton = 18,
    heightButton = 18,
    previewImgClassName,
    handleOnChange,
    disabled = false,
    isHide = false,
    setResizedImage,
  } = props;

  const { t } = useTranslation();
  let realType = ImportImageStyle.NORMAL;
  if (props.frameType) realType = props.frameType;
  const TYPE_MAP = {
    [ImportImageStyle.NORMAL]: '',
    [ImportImageStyle.CIRCLE]: style.circle,
    [ImportImageStyle.DASHED]: style.dashed,
  };

  const PREVIEW_IMG_MAP = {
    [ImportImageStyle.NORMAL]: DefaultLogo,
    [ImportImageStyle.CIRCLE]: DefaultAvatar,
    [ImportImageStyle.DASHED]: DefaultDashed,
  };

  const [previewImage, setPreviewImage] = useState<string>(PREVIEW_IMG_MAP[realType]);
  const id = `${name}${Date.now()}`;

  const handleUploadImage = (image: File) => {
    const options = {
      maxSizeMB: 0.4,
      useWebWorker: true,
      maxWidthOrHeight: 1920,
      initialQuality: 0.7,
    };
    imageCompression(image, options)
      .then((compressedBlob: any) => {
        const convertedBlobFile = new File([compressedBlob], image.name, {
          type: image.type,
          lastModified: Date.now(),
        });
        setResizedImage && setResizedImage(convertedBlobFile);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const onChangeImage = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const imageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg', 'image/bmp', 'image/webp'];

    if (e.target.files) {
      const reader = new FileReader();
      const image = e.target.files[0];

      setResizedImage && setResizedImage(undefined);

      if (image) {
        if (!imageTypes.includes(image.type)) {
          const strImageFiles = '.png, .jpg, .gif, .svg, .bmp, .webp';
          Alert.error({ title: 'Oops!', content: `${t('error.fileType')} ${strImageFiles}` });
          e.target.value = '';
          return;
        }

        if (image.size > 500000) {
          handleUploadImage(image);
        }

        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setPreviewImage(reader.result);
            setDefaultImage && setDefaultImage(reader.result);
          }
        };
        if (image) {
          reader.readAsDataURL(image);
        }
      }
    }
  };

  const checkDottedStyleToggle = (e: MouseEvent<HTMLImageElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    realType === ImportImageStyle.DASHED && toggleImage(e);
  };

  const toggleImage = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>): void => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById(`${id}`)?.click();
  };

  const imgStyle = `${style.previewImage} ${TYPE_MAP[realType]} ${
    defaultImage && realType === ImportImageStyle.DASHED && style.objContain
  } ${previewImgClassName}`;

  useEffect(() => {
    defaultImage && setPreviewImage(defaultImage);
    defaultImage === '' && setPreviewImage(PREVIEW_IMG_MAP[realType]);
    // eslint-disable-next-line
  }, [defaultImage]);

  return (
    <div style={{ width: width, height: height }} className={`${style.importImage} ${className}`}>
      {!isHide && (
        <div className={`${style.btnEdit} ${TYPE_MAP[realType]} ${realType === ImportImageStyle.DASHED && 'd-none'} `} onClick={toggleImage}>
          <SVGIcon icon='Edit' color={Palette.BLUE} size={widthButton} />
        </div>
      )}

      <Image width={width} height={height} className={imgStyle} src={previewImage} alt='edit' onClick={checkDottedStyleToggle} />
      <label htmlFor={name}>
        <input
          id={id}
          name={name}
          className='d-none'
          onChange={(e) => {
            onChangeImage(e);
            if (handleOnChange) handleOnChange(false);
          }}
          type='file'
          accept='image/png,image/jpeg,image/gif,image/svg,image/bmp,image/webp'
          ref={register}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default ImportImage;
