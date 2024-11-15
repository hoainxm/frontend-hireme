import { useHistory } from 'react-router-dom';
import { Alert } from '../popup';
import { useTranslation } from 'react-i18next';
import { PageURL } from '../../../models/enum';

const useVerificationAlert = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const redirectToVerification = () => {
    history.push(PageURL.RESEND_VERIFY_EMAIL);
  };

  const isVerificationRequired = () =>
    Alert.warning({
      title: t('verificationRequired'),
      content: t('popup.verificationRequiredMessage'),
      labelBtnCfm: t('auth.verifyAccount'),
      onConfirm: redirectToVerification,
    });

  return { isVerificationRequired };
};

export default useVerificationAlert;
