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

export type GeneralDataType = {
  missionTitle: FormBoxData
  clientName: FormBoxData
  startDate: FormBoxData
  NbCollaborators: FormBoxData
  missionDuration: FormBoxData
  missionSector: FormBoxData
}

export interface movementBoxData {
  optionName: string;
  movementFrequency?: string;
  numberOfMovement?: number;
  averageKmPerTrip?: number;
  informationSource?: InformationSourceData
}
export type MovementDataType = {
  movementDataList: movementBoxData[]
}

export type DigitalItemType = {
  name?: string
  count?: number
}
export interface DigitalBoxData {
  optionName: string;
  itemList?: DigitalItemType[];
  informationSource?: InformationSourceData;
}
// export type DigitalDataType = {
//   digitalDataList: DigitalBoxData[]
// }