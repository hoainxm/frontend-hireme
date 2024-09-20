import { AIFeature } from "@models/enum"
import { getRemainTurn } from "../../../app/trial/api"
import { RemainTurn } from "../../../app/trial/model"
import { useEffect, useState } from "react"
import { useGetTrialAPIKey } from "./useGetTrialAPIKey"


export const useGetRemainTurn = () => {
  const { trialAPIKey } = useGetTrialAPIKey();

  const [loadingRemainTurn, setLoadingRemainTurn] = useState<boolean>(false);
  const [remainTurns, setRemainTurns] = useState<RemainTurn>({
    total: 0,
    remaining: 0,
  });

  const getTrialTurn = (featureId: number) => {
    getRemainTurn(featureId)
      .then((res) => {
        const data: RemainTurn = res.data;
        setRemainTurns(data);
      })
      .catch(() => setLoadingRemainTurn(false))
      .finally(() => setLoadingRemainTurn(false));
  }

  useEffect(() => {
    if (!trialAPIKey) return;
    const featureId = trialAPIKey.ai_feature?.id;
    if (featureId) {
      getTrialTurn(featureId)
    }
  }, [trialAPIKey]);

  return { trialAPIKey, loadingRemainTurn, ...remainTurns, getTrialTurn }
}