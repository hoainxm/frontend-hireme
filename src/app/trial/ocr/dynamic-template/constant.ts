import InbodyErrorBlur from '@images/InbodyErrorBlur.png';
import InbodyErrorGlare from '@images/InbodyErrorGlare.png';
import InbodyErrorAngel from '@images/InbodyErrorAngel.png';
import InbodyErrorCurved from '@images/InbodyErrorCurved.png';
import PrescriptionErrorClose from '@images/PrescriptionErrorClose.png';
import OCRErrorBlur from '@images/OCRErrorBlur.png';
import OCRErrorGlare from '@images/OCRErrorGlare.png';
import OCRErrorAngel from '@images/OCRErrorAngel.png';
import OCRErrorClose from '@images/OCRErrorClose.png';

export const PAPER_DYNAMIC_EXTRACTED_CASES = [
  {
    image: InbodyErrorAngel,
    content: { label: 'image.error.skew', value: 30 },
  },
  {
    image: PrescriptionErrorClose,
    content: { label: 'image.requirement.distance', value: 'paper' },
  },
  {
    image: InbodyErrorBlur,
    content: { label: 'image.error.blur', value: '' },
  },
  {
    image: InbodyErrorGlare,
    content: { label: 'image.error.glare', value: '' },
  },
  {
    image: InbodyErrorCurved,
    content: { label: 'image.error.curved', value: '' },
  },
];

export const LCD_DYNAMIC_EXTRACTED_CASES = [
  {
    image: OCRErrorAngel,
    content: { label: 'image.error.skew', value: 45 },
  },
  {
    image: OCRErrorClose,
    content: { label: 'image.requirement.distance', value: 'device' },
  },
  {
    image: OCRErrorBlur,
    content: { label: 'image.error.blur', value: '' },
  },
  {
    image: OCRErrorGlare,
    content: { label: 'image.error.glare', value: '' },
  },
];

export const MAX_ZOOM = 4;
export const MIN_ZOOM = 1;
