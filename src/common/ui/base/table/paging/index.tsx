/** @format */

import React, { FC, HTMLAttributes, useMemo } from "react";

import PagingItem from "./PagingItem";
import style from "./paging.module.scss";

interface Props extends HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPage: number;
  onGetData: (page: number, ...arg: Array<any>) => void;
  extra?: Array<any>;
}

const CTPaging: FC<Props> = (props: Props) => {
  const { currentPage, totalPage, onGetData, extra = [] } = props;
  const DOT_POSITION = -1;

  const range = (start: number, end: number) => {
    let length = end - start + 1;
    /* Create an array of certain length and set the elements within it from start value to end value. */
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getLastPage = (paginationRange: Array<number>) => {
    return paginationRange[paginationRange.length - 1];
  };

  const paginationRange = useMemo(() => {
    const siblingCount = 1;
    const totalPageCount = totalPage;
    // Pages count is determined as siblingCount: firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount * 2 + 5;

    /*
    Case 1:
    If the number of pages is less than the page numbers we want to show in our
    paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    /* Calculate left and right sibling index and make sure they are within range 1 and totalPageCount */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
    We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = currentPage > 3 + siblingCount;
    const shouldShowRightDots =
      currentPage < totalPageCount - (2 + siblingCount);

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
    Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = Math.max(
        1 + 2 * siblingCount,
        currentPage + siblingCount
      );
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOT_POSITION, totalPageCount];
    }

    /* Case 3: No right dots to show, but left dots to be shown */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 1 + 2 * siblingCount;
      let rightRange = range(
        Math.min(
          totalPageCount - rightItemCount + 1,
          currentPage - siblingCount
        ),
        totalPageCount
      );
      return [firstPageIndex, DOT_POSITION, ...rightRange];
    }

    /* Case 4: Both left and right dots to be shown */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [
        firstPageIndex,
        DOT_POSITION,
        ...middleRange,
        DOT_POSITION,
        lastPageIndex,
      ];
    }
  }, [totalPage, currentPage]);

  return (
    <>
      {currentPage !== 0 && paginationRange && paginationRange?.length > 0 && (
        <div
          className={`${style.paging} ${props.className}`}
          style={props.style}
        >
          <div className={style.content}>
            <PagingItem
              prev
              active={currentPage !== 1}
              onClick={() => onGetData(currentPage - 1, ...extra)}
            />
            {paginationRange.map((page, index) =>
              page === DOT_POSITION ? (
                <div key={index} className={style.item}>
                  ...
                </div>
              ) : (
                <PagingItem
                  key={index}
                  active={page === currentPage}
                  onClick={() => onGetData(page, ...extra)}
                >
                  {page}
                </PagingItem>
              )
            )}
            <PagingItem
              next
              active={currentPage !== getLastPage(paginationRange)}
              onClick={() => onGetData(currentPage + 1, ...extra)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CTPaging;
