import { Shortcut } from "@layout/model";
import { PageName, PageURL } from "@models/enum";

export const trialShortcutData: Array<Shortcut> = [
  {
    name: PageName.COMPUTER_VISION,
    url: PageURL.OCR,
    icon: "CPV",
    isActive: false,
    subName: [
      {
        name: PageName.OCR,
        url: PageURL.OCR,
        isActive: false
      },
      {
        name: PageName.OD,
        url: PageURL.OCR,
        isActive: false
      },
    ],
  },
  {
    name: PageName.NATURAL_LANGUAGE,
    url: "",
    icon: "NLP",
    isActive: false
  },
  {
    name: PageName.DATA_ANALYTICS,
    url: "",
    icon: "DA",
    isActive: false
  },
  {
    name: PageName.AUDIO_SPEECH,
    url: "",
    icon: "Speech",
    isActive: false
  }
];