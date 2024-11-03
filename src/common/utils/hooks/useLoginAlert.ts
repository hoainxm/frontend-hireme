import { useHistory } from 'react-router-dom';
import { Alert } from '../popup';
import { useTranslation } from 'react-i18next';
import { PageURL } from '../../../models/enum';

const useLoginAlert = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const redirectToLogin = () => {
    history.push(PageURL.LOGIN);
  };

  const isLoginRequired = () =>
    Alert.warning({
      title: t('loginToContinue'),
      content: t('popup.loginRequired'),
      labelBtnCfm: t('auth.login'),
      onConfirm: redirectToLogin,
    });

  return { isLoginRequired };
};

export default useLoginAlert;
