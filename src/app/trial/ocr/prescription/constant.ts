import PrescriptionErrorBlur from '@images/PrescriptionErrorBlur.png'
import PrescriptionErrorGlare from '@images/PrescriptionErrorGlare.png'
import PrescriptionErrorAngel from '@images/PrescriptionErrorAngel.png'
import PrescriptionErrorClose from '@images/PrescriptionErrorClose.png'
import PrescriptionErrorCurved from '@images/PrescriptionErrorCurved.png'

export const PRESCRIPTION_EXTRACTABLE_INFORMATION_FIELDS: Array<{ title: string, fields: Array<string> }> = [
  {
    title: 'prescriptionCreatedDate',
    fields: ['date', 'time']
  },
  {
    title: 'medicineInformation',
    fields: ['medicine_name', 'duration', 'strength', 'instruction', 'quantity', 'form', 'dosage', 'route', 'medicationTiming']
  },
  {
    title: 'followUpSchedule',
    fields: ['date', 'time', 'note']
  }
]

export const PRESCRIPTION_IMAGE_REQUIREMENTS = [
  { label: 'image.requirement.fullPrescription', value: '' },
  { label: 'image.requirement.skew', value: 30 },
  { label: 'image.requirement.distance', value: 'paper' },
  { label: 'image.requirement.avoidBlur', value: '' },
  { label: 'image.requirement.paperCurved', value: '' }
]

export const PRESCRIPTION_NON_EXTRACTED_CASES = [
  {
    image: PrescriptionErrorBlur,
    content: { label: 'image.error.blur', value: '' }
  },
  {
    image: PrescriptionErrorGlare,
    content: { label: 'image.error.glare', value: '' }
  },
  {
    image: PrescriptionErrorAngel,
    content: { label: 'image.error.skew', value: 30 }
  },
  {
    image: PrescriptionErrorClose,
    content: { label: 'image.error.close', value: 'paper' }
  },
  {
    image: PrescriptionErrorCurved,
    content: { label: 'image.error.curved', value: '' }
  }
]

export const INITIAL_BODY_FIELDS = [
  'medicine_name',
  // 'duration',
  // 'strength',
  'instruction',
  'quantity',
  'form',
  'dosage',
  'route',
  'medication_timing'
]

export const DOSAGE_LANGUAGE_MAPPING: Record<string, string> = {
  "morning": "sáng",
  "noon": "trưa",
  "evening": "chiều",
  "night": "tối"
}