import { IconMapName } from "common/ui/assets/icon"
import Files from '@images/Files.png'
import Template from '@images/Template.png'
import OCR from '@images/OCR.png'
import FieldExtraction from '@images/FieldExtraction.png'
import PostProcessing from '@images/PostProcessing.png'
import Result from '@images/Result.png'

import AND from '@images/AND.png'
import MEDIUSA from '@images/MEDIUSA.png'
import MICROLIFE from '@images/MICROLIFE.png'
import OMRON from '@images/OMRON.png'
import WELLUE from '@images/WELLUE.png'
import SINOCARE from '@images/SINOCARE.png'
import CHECKME from '@images/CHECKME.png'
import ACCUCHEK from '@images/ACCUCHEK.png'

import BP from '@images/BP.png'
import BG from '@images/BG.png'
import Temp from '@images/Temp.png'
import { FC } from "react"
import { Banner } from "./Banner"
import { WhyOCRSection } from "./WhyOCRSection"
import { MedicalDeviceSection } from "./MedicalDeviceSection"
import { InBodySection } from "./InBodySection"
import { SectionID } from "../../../models/enum"
import { PrescriptionSection } from "./PrescriptionSection"

interface WhyOCRItem {
  icon: keyof typeof IconMapName,
  title: string,
  contents: Array<string>
}

interface RoadMapItem {
  title: string
  srcImage: string
  contents: Array<string>
}

export const OCR_PAGE_SECTIONS: Array<{ sectionId: SectionID, text: string, section: FC<any> }> = [
  {
    sectionId: SectionID.OCR_BANNER,
    text: "product.ocr",
    section: Banner
  },
  {
    sectionId: SectionID.OCR_WHY,
    text: "product.ocr.whyOCR",
    section: WhyOCRSection
  },
  {
    sectionId: SectionID.OCR_MD,
    text: "product.ocr.medicalDevice",
    section: MedicalDeviceSection
  },
  {
    sectionId: SectionID.OCR_IB,
    text: "product.ocr.inBody",
    section: InBodySection
  },
  {
    sectionId: SectionID.OCR_PRESCRIPTION,
    text: "product.ocr.prescription",
    section: PrescriptionSection
  },
]

export const WHY_OCR_ITEMS: Array<WhyOCRItem> = [
  {
    icon: "AISpeed",
    title: "product.ocr.why.diversity.title",
    contents: [
      "product.ocr.why.diversity.highlight.first",
      "product.ocr.why.diversity.highlight.second",
      "product.ocr.why.diversity.highlight.third"
    ]
  },
  {
    icon: "EasyIntegrate",
    title: "product.ocr.why.integrate.title",
    contents: [
      "product.ocr.why.integrate.highlight.first",
      "product.ocr.why.integrate.highlight.second",
      "product.ocr.why.integrate.highlight.third"
    ]
  },
  {
    icon: "LowerCost",
    title: "product.ocr.why.performance.title",
    contents: [
      "product.ocr.why.performance.highlight.first",
      "product.ocr.why.performance.highlight.second",
    ]
  }
]

export const ROAD_MAP_OCR_PRODUCT: Array<RoadMapItem> = [
  {
    title: "product.ocr.roadmap.first.step.title",
    srcImage: Files,
    contents: [
      "product.ocr.roadmap.first.step.highlight.first",
      "product.ocr.roadmap.first.step.highlight.second"
    ]
  },
  {
    title: "product.ocr.roadmap.second.step.title",
    srcImage: Template,
    contents: [
      "product.ocr.roadmap.second.step.highlight.first",
      "product.ocr.roadmap.second.step.highlight.second"
    ]
  },
  {
    title: "product.ocr.roadmap.third.step.title",
    srcImage: OCR,
    contents: [
      "product.ocr.roadmap.third.step.highlight.first",
      "product.ocr.roadmap.third.step.highlight.second"
    ]
  },
  {
    title: "product.ocr.roadmap.fourth.step.title",
    srcImage: FieldExtraction,
    contents: [
      "product.ocr.roadmap.fourth.step.highlight.first"
    ]
  },
  {
    title: "product.ocr.roadmap.fifth.step.title",
    srcImage: PostProcessing,
    contents: [
      "product.ocr.roadmap.fifth.step.highlight.first",
      "product.ocr.roadmap.fifth.step.highlight.second"
    ]
  },
  {
    title: "product.ocr.roadmap.six.step.title",
    srcImage: Result,
    contents: [
      "product.ocr.roadmap.six.step.highlight.first"
    ]
  }
]

export const MEDICAL_PARTNERS = [
  AND, MEDIUSA, MICROLIFE, OMRON, WELLUE, SINOCARE, CHECKME, ACCUCHEK
]

export const MEDICAL_SPECS = [
  {
    image: BP,
    text: "product.ocr.medicalDevice.bloodPressure"
  },
  {
    image: BG,
    text: "product.ocr.medicalDevice.bloodGlucose"
  },
  {
    image: Temp,
    text: "product.ocr.medicalDevice.temperature"
  }
]