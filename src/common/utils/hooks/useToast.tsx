import { ToastItem } from '@layout/model';
import { addToast, removeToast } from '@layout/slice';
import { RootState } from 'store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { COUNT_DOWN } from '../constants';

export const useToast = () => {
  const { toasts, toastIdCounter } = useSelector((state: RootState) => state.toasts);
  const dispatch = useDispatch();

  const showToast = (toast: ToastItem) => {
    dispatch(addToast(toast));
    setTimeout(
      () => {
        dispatch(removeToast(toastIdCounter));
      },
      !toast.duration ? COUNT_DOWN.TOAST_DURATION : toast.duration
    );
  };

  return {
    toasts,
    showToast,
  };
};
