/* ToDo - improve Data Receive */


export type InformationSourceData = {
  informationOrigin?: InformationOriginType
  reliabilityRate?: number
  foundOnPage?: number  
  isInformationEnriched?: string
  enrichedBasedOnTheDocument?: boolean
  enrichedFromKnowledge?:boolean
  enrichedReliabilityRate?: number
}

export interface FormBoxData<T = string> {
  id: string;
  value: T
  unit?:string
  informationSource?: InformationSourceData
}

export type GeneralBoxData = {
  missionTitle: FormBoxData
  clientName: FormBoxData
  startDate: FormBoxData
  nbCollaborators: FormBoxData<number>
  missionDuration: FormBoxData<number>
  missionSector: FormBoxData
}

export interface MovementBoxData {
  optionName: string;
  movementFrequency?: string;
  numberOfMovement?: number;
  averageKmPerTrip?: number;
  informationSource?: InformationSourceData;
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
  formListData?: FormListData; 
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

export enum InformationOriginType {
  fromDocument = "foundInDocument",
  fromKnowledge = "deducedFromknowledge"
}

export enum InformationType {
  needed = "needed",
  noNeeded = "noNeeded",
  unableToIdentify = "unableToIdentify"
}
