import { useTranslation } from 'react-i18next';
import InbodyErrorBlur from '@images/InbodyErrorBlur.png'
import InbodyErrorGlare from '@images/InbodyErrorGlare.png'
import InbodyErrorAngel from '@images/InbodyErrorAngel.png'
import InbodyErrorClose from '@images/InbodyErrorClose.png'
import InbodyErrorCurved from '@images/InbodyErrorCurved.png'

export const INBODY_EXTRACTABLE_INFORMATION_FIELDS: Array<{ title: string, fields: Array<string> }> = [
  {
    title: "Overall",
    fields: ['ID', 'Height', 'Age', 'Gender', 'Test Date & Time']
  },
  {
    title: "Body Composition Analysis",
    fields: ['Total Body Water', 'Protein', 'Minerals', 'Body Fat Mass', 'Weight']
  },
  {
    title: "Muscle-Fat Analysis",
    fields: ['Weight', 'SMM', 'Body Fat Mass']
  },
  {
    title: "Obesity Analysis",
    fields: ['BMI', 'PBF']
  },
  {
    title: "InBody Score",
    fields: ['InBody Score']
  },
  {
    title: "Weight Control",
    fields: ['Target Weight', 'Weight Control', 'Fat Control', 'Muscle Control']
  }
]

export const INBODY_IMAGE_REQUIREMENTS = [
  { label: 'image.requirement.skew', value: 45 },
  { label: 'image.requirement.distance', value: 'device' },
  { label: 'image.requirement.avoidBlur', value: '' },
  { label: 'image.requirement.paperCurved', value: '' }
]

export const INBODY_NON_EXTRACTED_CASES = [
  {
    image: InbodyErrorBlur,
    content: { label: 'image.error.blur', value: '' }
  },
  {
    image: InbodyErrorGlare,
    content: { label: 'image.error.glare', value: '' }
  },
  {
    image: InbodyErrorAngel,
    content: { label: 'image.error.skew', value: 20 }
  },
  {
    image: InbodyErrorClose,
    content: { label: 'image.error.close', value: 'paper' }
  },
  {
    image: InbodyErrorCurved,
    content: { label: 'image.error.curved', value: '' }
  }
]