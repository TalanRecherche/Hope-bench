/* ToDo - improve Data Receive */
import { z } from "zod";

export type InformationSourceData = {
  foundInClientDocument?: boolean
  deduceByReadingDocument?: boolean
  personalKnowlegdeUsed?: boolean
  enrichedFromDocument?: boolean
  reliabilityRate?: number
  foundOnPage?: number
}
export const InformationSourceDataSchema = z.object({
  foundInClientDocument: z.boolean().optional(),
  deduceByReadingDocument: z.boolean().optional(),
  personalKnowlegdeUsed: z.boolean().optional(),
  enrichedFromDocument: z.boolean().optional(),
  reliabilityRate: z.number().optional(),
  foundOnPage: z.number().optional()
});

export type InformationSourceDataBis = z.infer<typeof InformationSourceDataSchema>;

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