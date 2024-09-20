import { createTrialAPIKey, getListTrialAPIKey } from "@layout/api"
import { AIAPIKey } from "../../../app/dashboard/model"
import { useEffect, useState } from "react"
import { APIResponse } from "../baseAPI"
import { FEATURE_MAPPING } from "../constants"
import { Alert } from "../popup"
import { useTranslation } from "react-i18next"

export const useGetTrialAPIKey = () => {
  const { t } = useTranslation()

  const [loadingGetTrialAPIKey, setLoadingGetTrialAPIKey] = useState<boolean>(false)
  const [trialAPIKey, setTrialAPIKey] = useState<AIAPIKey>()

  useEffect(() => {
    setLoadingGetTrialAPIKey(true)
    getListTrialAPIKey().then((res) => {
      const data: APIResponse<AIAPIKey> = res.data
      const findTrialKey = data.results.find(result => result.ai_feature?.id === FEATURE_MAPPING[window.location.pathname])
      if (!findTrialKey) {
        createTrialAPIKey(FEATURE_MAPPING[window.location.pathname]).then((res) => {
          const id = res.data.api_key
          setTrialAPIKey({ ...res.data, id })
        })
      } else {
        setTrialAPIKey(findTrialKey)
      }
    }).catch((err) => {
      Alert.error({ title: 'Oops!', content: t('error.stWrong') });
    }).finally(() => setLoadingGetTrialAPIKey(false))
  }, [])

  return { loadingGetTrialAPIKey, trialAPIKey }
}
