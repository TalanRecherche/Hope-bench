/* ToDo - improve Data Receive */

export type InformationSourceData = {
  foundInClientDocument?: boolean
  deduceByReadingDocument?: boolean
  personalKnowlegdeUsed?: boolean
  enrichedFromDocument?: boolean
  reliabilityRate?: number
  foundOnPage?: number
}

export interface FormBoxData {
  id: string;
  value?: string
  informationSource?: InformationSourceData
}

export type GeneralBoxData = {
  missionTitle: FormBoxData
  clientName: FormBoxData
  startDate: FormBoxData
  NbCollaborators: FormBoxData
  missionDuration: FormBoxData
  missionSector: FormBoxData
}

export interface MovementBoxData {
  optionName: string;
  movementFrequency?: string;
  numberOfMovement?: number;
  averageKmPerTrip?: number;
  informationSource?: InformationSourceData
}

export type BoxItemType = {
  name?: string
  count?: number
}

export interface DigitalBoxData {
  optionName: string;
  itemList?: BoxItemType[];
  informationSource?: InformationSourceData;
}

export interface OfficeBoxData {
  itemList: BoxItemType[];
  informationSource?: InformationSourceData;
}

export interface FormData {
  formName: string;
  formStatus?: FormStatus;
  generalBoxData?: GeneralBoxData; 
  movementBoxData?: MovementBoxData;
  digitalBoxData?: DigitalBoxData;
  officeData?: OfficeBoxData;
}

export type CustomSwitchOptions = {
  option1: {
    label: string, 
    checked: boolean
  }, 
  option2: {
    label: string, 
    checked: boolean
  }
}

export type FormListData = {
  name : string; 
  format: string;
  numberOfPages: number;
  lastUpdate: Date;
  status : string;
}

export enum FormStatus {
  toStart = 'À commencer',
  started = 'En cours',
  submitted = 'Soumis'
}