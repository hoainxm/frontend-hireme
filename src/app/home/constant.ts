import BannerComputerVision from '@images/BannerComputerVision.png';
import BannerNLP from '@images/BannerNLP.png';
import BannerDA from '@images/BannerDA.png';
import BannerSpeechProcessing from '@images/BannerSpeechProcessing.png';

import Posting from '@images/Posting.svg';
import Hire from '@images/Hire.svg';
import Contact from '@images/Contact.svg';
import ViewProfile from '@images/ViewProfile.svg';
import FileManage from '@images/FileManage.svg';
import Rating from '@images/Rating.svg';
import BuildingCompany from '@images/BuildingCompany.svg';
import Location from '@images/Location.svg';

import Profile from '@images/Profile.svg';
import Searching from '@images/Searching.svg';
import Apply from '@images/Apply.svg';
import Notifications from '@images/Notifications.svg';
import Process from '@images/Process.svg';
import ContactWith from '@images/ContactWith.svg';
import Export from '@images/Export.svg';
import BuildingNetwork from '@images/BuildingNetwork.svg';

import ADVANTECH from '@images/ADVANTECH.png';
import INTEL from '@images/INTEL.png';
import ASUS from '@images/ASUS.png';
import BKAV from '@images/BKAV.png';
import NVIDIA from '@images/NVIDIA.png';
import TOPCV from '@images/TopCV.png';
import VIETNAMWORKS from '@images/VIETNAMWORKS.png';
import LINKEDIN from '@images/LINKEDIN.png';
import ADLINK from '@images/ADLINK.png';

import { IconMapName } from '../../common/ui/assets/icon';
import { TabItem } from '../../common/ui/layout/model';
import { IPH } from './components/projects/IPH';
import { FC } from 'react';
import { JapanTrainStation } from './components/projects/JapanTrainStation';
import { VTTruckMonitoring } from './components/projects/VTTruckMonitoring';
import { ParkingLot } from './components/projects/ParkingLot';
import { TLocker } from './components/projects/TLocker';
import { OCRMCare } from './components/projects/OCRMCare';
import { DocumentReader } from './components/projects/DocumentReader';
import { Banner } from './Banner';
import { RecrutingSection } from './RecruitingSection';
// import { NLPSection } from './UpdateSection';
import { DASection } from './DASection';
import { SpeechSection } from './SpeechSection';
import { TypicalProjectSection } from './TypicalProjectSection';
import { ServiceSection } from './ServiceSection';
import { PartnerSection } from './PartnerSection';
import { WhyHireMeSection } from './WhyHireMeSection';
import { CDP } from './components/projects/CDP';
import { YOUTUBE_VIDEO_ID } from '../../common/utils/constants';
import { SectionID } from '../../models/enum';
import UpdateSection from './UpdateSection';

interface Item {
  icon: keyof typeof IconMapName;
  content: string;
}

export const STRENGTH_POINTS: Array<Item> = [
  {
    icon: 'Experience',
    content: 'home.experience',
  },
  {
    icon: 'Client',
    content: 'home.client',
  },
];

export const BANNER_PRODUCT_ITEMS = [
  {
    styleName: 'cv',
    image: BannerComputerVision,
    productName: 'product.computerVision',
  },
  {
    styleName: 'nlp',
    image: BannerNLP,
    productName: 'product.naturalLanguage',
  },
  {
    styleName: 'da',
    image: BannerDA,
    productName: 'product.dataAnalytics',
  },
  {
    styleName: 'sp',
    image: BannerSpeechProcessing,
    productName: 'product.speechProcessing',
  },
];

export const WHY_HIRE_ME_ITEMS: Array<Item> = [
  {
    icon: 'Customer',
    content: 'home.whyHireMe.customer',
  },
  {
    icon: 'AISpeed',
    content: 'home.whyHireMe.speed',
  },
  {
    icon: 'Project',
    content: 'home.whyHireMe.experienceImplement',
  },
];

export const EMPLOYERS = [
  {
    image: Posting,
    content: 'product.employer.posting',
  },
  {
    image: Hire,
    content: 'product.employer.hire',
  },
  {
    image: Contact,
    content: 'product.employer.contact',
  },
  {
    image: ViewProfile,
    content: 'product.employer.viewprofile',
  },
  {
    image: FileManage,
    content: 'product.employer.filemanage',
  },
  {
    image: Rating,
    content: 'product.employer.rating',
  },
  {
    image: BuildingCompany,
    content: 'product.employer.buildconpany',
  },
  {
    image: Location,
    content: 'product.employer.location',
  },
];

export const CANDIDATES = [
  {
    image: Profile,
    content: 'product.candidate.profile',
  },
  {
    image: Searching,
    content: 'product.candidate.searching',
  },
  {
    image: Apply,
    content: 'product.candidate.apply',
  },
  {
    image: Notifications,
    content: 'product.candidate.notifications',
  },
  {
    image: Process,
    content: 'product.candidate.process',
  },
  {
    image: Export,
    content: 'product.candidate.export',
  },
  {
    image: ContactWith,
    content: 'product.candidate.contactwith',
  },
  {
    image: BuildingNetwork,
    content: 'product.candidate.buildingnetwork',
  },
];

export const NLP_ITEMS: Array<Item> = [
  {
    icon: 'NameEntity',
    content: 'product.naturalLanguage.namedEntityRecognition',
  },
  {
    icon: 'Sentiment',
    content: 'product.naturalLanguage.sentimentAnalysis',
  },
  {
    icon: 'Description',
    content: 'product.naturalLanguage.descriptionGeneration',
  },
  {
    icon: 'DocClassify',
    content: 'product.naturalLanguage.documentClassification',
  },
  {
    icon: 'InfoExtraction',
    content: 'product.naturalLanguage.informationExtraction',
  },
  {
    icon: 'QA',
    content: 'product.naturalLanguage.qaModel',
  },
  {
    icon: 'Summarize',
    content: 'product.naturalLanguage.documentSummarization',
  },
  {
    icon: 'LLM',
    content: 'product.naturalLanguage.llm',
  },
];

export const DA_ITEMS = [
  'product.dataAnalytics.dataPreprocessing',
  'product.dataAnalytics.dataCollection',
  'product.dataAnalytics.dataPipeline',
  'product.dataAnalytics.visualization',
  'product.dataAnalytics.bigDataProcess',
  'product.dataAnalytics.deepLearning',
];

export const SPEECH_ITEMS: Array<Item> = [
  {
    icon: 'VoiceRecognition',
    content: 'product.speechProcessing.speechToText',
  },
  {
    icon: 'TextToSpeech',
    content: 'product.speechProcessing.textToSpeech',
  },
  {
    icon: 'Denose',
    content: 'product.speechProcessing.speechDenoising',
  },
];

export const SERVICE_ITEMS: Array<Item> = [
  {
    icon: 'Engineer',
    content: 'cooperationModel.outsource',
  },
  {
    icon: 'Solution',
    content: 'cooperationModel.consultant',
  },
  {
    icon: 'API',
    content: 'cooperationModel.api',
  },
];

export const PARTNER_IMAGES = [ADLINK, NVIDIA, ASUS, INTEL, BKAV, ADVANTECH, TOPCV, VIETNAMWORKS, LINKEDIN];

export const TYPICAL_PROJECT_TABS: Array<TabItem & { videoId: string; component: FC<any> }> = [
  { name: 'project.iph', contentId: 'iphtab', videoId: YOUTUBE_VIDEO_ID.IPH, component: IPH },
  { name: 'project.jpTrainStation', contentId: 'jptab', videoId: YOUTUBE_VIDEO_ID.JP_TRAIN, component: JapanTrainStation },
  { name: 'project.vtTruckMonitoring', contentId: 'vttab', videoId: YOUTUBE_VIDEO_ID.VT_TRUCK, component: VTTruckMonitoring },
  { name: 'project.parkingLot', contentId: 'pltab', videoId: YOUTUBE_VIDEO_ID.PARKING_LOT, component: ParkingLot },
  { name: 'project.tLocker', contentId: 'tltab', videoId: YOUTUBE_VIDEO_ID.TLOCKER, component: TLocker },
  { name: 'project.ocrMCare', contentId: 'ocrtab', videoId: YOUTUBE_VIDEO_ID.OCR_MCARE, component: OCRMCare },
  { name: 'project.docsReader', contentId: 'drtab', videoId: YOUTUBE_VIDEO_ID.DOCS_READER, component: DocumentReader },
  { name: 'project.cdp', contentId: 'cdptab', videoId: YOUTUBE_VIDEO_ID.CDP, component: CDP },
];

export const HOME_PAGE_SECTIONS: Array<{ sectionId: SectionID; text: string; section: FC<any> }> = [
  {
    sectionId: SectionID.HOME_BANNER,
    text: 'title.name',
    section: Banner,
  },
  {
    sectionId: SectionID.HOME_CV,
    text: 'product.recruiting',
    section: RecrutingSection,
  },
  // {
  //   sectionId: SectionID.HOME_DA,
  //   text: 'product.dataAnalytics',
  //   section: DASection,
  // },
  // {
  //   sectionId: SectionID.HOME_AS,
  //   text: 'product.speechProcessing',
  //   section: SpeechSection,
  // },
  // {
  //   sectionId: SectionID.HOME_PROJECT,
  //   text: 'title.project',
  //   section: TypicalProjectSection,
  // },
  {
    sectionId: SectionID.HOME_SERVICE,
    text: 'title.service',
    section: ServiceSection,
  },
  {
    sectionId: SectionID.HOME_PARTNERS,
    text: 'title.partner',
    section: PartnerSection,
  },
  {
    sectionId: SectionID.HOME_WHY,
    text: 'title.whyHireMe',
    section: WhyHireMeSection,
  },
  {
    sectionId: SectionID.HOME_UPDATE,
    text: 'product.updateSection',
    section: UpdateSection,
  },
];
