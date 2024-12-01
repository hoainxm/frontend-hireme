import { useHistory } from 'react-router-dom';
import { Alert } from '../popup';
import { useTranslation } from 'react-i18next';
import { PageURL } from '../../../models/enum';

const useUpgradeAlert = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const redirectToUpgrade = () => {
    history.push(PageURL.UPGRADE);
  };

  const isUpgradeRequired = () =>
    Alert.warning({
      title: t('upgradeToContinue'),
      content: t('popup.upgradeRequired'),
      labelBtnCfm: t('upgrade.upgrade'),
      onConfirm: redirectToUpgrade,
    });

  return { isUpgradeRequired };
};

export default useUpgradeAlert;
