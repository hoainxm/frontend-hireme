import { NEXT_SORT, TYPE_SORT } from "../../../../utils/constants";
import { useEffect, useRef, useState } from "react";
interface Props {
  fieldMapHandleSort: Partial<Record<string, any>>;
  dataSort: Array<any>;
}

const useSort = (props: Props) => {
  const { dataSort = [] } = props;
  const [currentSort, setCurrentSort] = useState<TYPE_SORT>("none");
  const [currentField, setCurrentField] = useState<string>("");
  const initialRef = useRef<Array<any>>([]);

  const handleSort = (field: string, sort: string) => {
    if (sort === "none" && initialRef.current) {
      dataSort.forEach(
        (_, index) => (dataSort[index] = initialRef.current[index])
      );
    } else {
      dataSort.sort((a: any, b: any) =>
        sort === "asc"
          ? props.fieldMapHandleSort[field](a, b)
          : props.fieldMapHandleSort[field](b, a)
      );
    }
  };

  const handleClickSort = (field: string) => {
    const nextSort = currentField === field ? NEXT_SORT[currentSort] : "desc";
    handleSort(field, nextSort);
    setCurrentSort(nextSort);
    setCurrentField(field);
  };

  useEffect(() => {
    initialRef.current = Array.from(dataSort);
    currentField &&
      currentSort !== "none" &&
      handleSort(currentField, currentSort);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSort]);

  const checkSortProps = (name: string) => {
    return {
      type: name === currentField ? currentSort : "none",
      handleSort: () => handleClickSort(name),
    };
  };

  return {
    currentSort,
    currentField,
    handleSort,
    checkSortProps,
  };
};

export default useSort;
