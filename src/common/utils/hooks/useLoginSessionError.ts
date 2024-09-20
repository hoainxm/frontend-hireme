import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { PageURL } from "../../../models/enum";
import { Alert } from "../popup";

const useLoginSessionError = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const adminSession = (e: AxiosError, handler?: () => void) => {
    if (e.response?.status === 403)
      Alert.error({ title: 'Oops!', content: t('error.sessionExpired'), onClose: () => handler && handler(), onConfirm: () => history.push(PageURL.ADMIN_LOGIN) });
    else if (e.response?.status === 500) {
      Alert.error({ title: 'Oops!', content: e.response?.data.msg });
    } else if (
      e.response?.status === 404 &&
      e.response?.data.msg === "There is no backup file available."
    ) {
      Alert.error({ title: 'Oops!', content: t("error.fileBackup") });
    } else Alert.error({ title: 'Oops!', content: t('error.stWrong') });
  };

  return { adminSession };
};

export default useLoginSessionError;
