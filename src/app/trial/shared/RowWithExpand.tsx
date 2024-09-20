import React, { FC, ReactNode, useState } from 'react';
import style from './shared.module.scss';
import { Palette } from '@models/enum';
import { SVGIcon } from '../../../common/ui/assets/icon';

interface Props {
  headerColumns: number;
  titleExpand: string;
  children?: ReactNode;
}

export const RowWithExpand: FC<Props> = (props: Props) => {
  const { headerColumns, titleExpand, children } = props;
  const [isExpand, setIsExpand] = useState<boolean>(true);

  return (
    <>
      <tr>
        <td colSpan={headerColumns} className='p-0' onClick={() => setIsExpand(!isExpand)}>
          <div className={style.expand}>
            <p>{titleExpand}</p>
            <SVGIcon icon={isExpand ? 'ArrowUp': 'ArrowDown'} size={16} color={Palette.FOURTH_GRAY} />
          </div>
        </td>
      </tr>
      {isExpand && children}
    </>
  );
};
