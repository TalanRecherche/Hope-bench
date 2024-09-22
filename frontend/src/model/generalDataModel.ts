/* ToDo - improve Data Receive */

export interface InformationSourceData  {
  foundInClientDocument: boolean
  deduceByReadingDocument: boolean
  personalKnowlegdeUsed: boolean
  enrichedFromDocument: boolean
  reliabilityRate: number
  foundOnPage: number
}

export interface formBoxData {
    id: string;
    value?: string
    informationSource?: InformationSourceData
}

export type GeneralDataType = {
    missionTitle: formBoxData
    clientName: formBoxData
    startDate: formBoxData
    NbCollaborators: formBoxData
    missionDuration: formBoxData
    missionSector: formBoxData
}