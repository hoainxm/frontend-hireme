import { IconMapName } from "../../../../common/ui/assets/icon"
import BPMachine from '@images/BPMachine.png'
import BGMachine from '@images/BGMachine.png'
import TempMachine from '@images/TempMachine.png'

import OCRErrorBlur from '@images/OCRErrorBlur.png'
import OCRErrorGlare from '@images/OCRErrorGlare.png'
import OCRErrorAngel from '@images/OCRErrorAngel.png'
import OCRErrorClose from '@images/OCRErrorClose.png'

import BPFeature from '@images/BPFeature.png'
import BGFeature from '@images/BGFeature.png'
import TempFeature from '@images/TempFeature.png'
import { MedicalDeviceMeasureFunctions } from "@models/enum"

import i18next from 'i18next'
import { useTranslation } from "react-i18next"

interface ExtractableField {
  icon: keyof typeof IconMapName
  field: string
  src: string
  indicators: Array<string>
}

export const MEDICAL_DEVICE_EXTRACTABLE_INFORMATION_FIELDS: Array<ExtractableField> = [
  {
    icon: "BP",
    field: "measureBloodPressure",
    src: BPMachine,
    indicators: ["systolicBloodPressure", "diastolicBloodPressure", "heartRate"]
  },
  {
    icon: "BG",
    field: "measureBloodGlucose",
    src: BGMachine,
    indicators: ["bloodGlucose"]
  },
  {
    icon: "Temp",
    field: "measureTemperature",
    src: TempMachine,
    indicators: ["temperature"]
  }
]

export const MEDICAL_DEVICE_IMAGE_REQUIREMENTS = [
  { label: 'image.requirement.skew', value: 45 },
  { label: 'image.requirement.distance', value: 'device' },
  { label: 'image.requirement.avoidBlur', value: '' }
]

export const MEDICAL_DEVICE_NON_EXTRACTED_CASES = [
  {
    image: OCRErrorBlur,
    content: { label: 'image.error.blur', value: '' }
  },
  {
    image: OCRErrorGlare,
    content: { label: 'image.error.glare', value: '' }
  },
  {
    image: OCRErrorAngel,
    content: { label: 'image.error.skew', value: 45 }
  },
  {
    image: OCRErrorClose,
    content: { label: 'image.error.close', value: 'screen' }
  }
]

export const MEDICAL_DEVICE_OCR_FUNCTIONS = [
  {
    image: BPFeature,
    label: "measureBloodPressure",
    measure: MedicalDeviceMeasureFunctions.BP,
    isActive: false
  },
  {
    image: BGFeature,
    label: "measureBloodGlucose",
    measure: MedicalDeviceMeasureFunctions.BG,
    isActive: false
  },
  {
    image: TempFeature,
    label: "measureTemperature",
    measure: MedicalDeviceMeasureFunctions.TEMPERATURE,
    isActive: false
  }
]