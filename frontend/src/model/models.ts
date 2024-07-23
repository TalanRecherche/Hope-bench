import { z } from "zod";

const notEmptyString = z.string().trim().min(1)

export const Computer = z.object({
	model: notEmptyString,
	number_provided: z.number(),
	provided_by_talan: z.boolean(),
});

export const Phone = z.object({
	model: notEmptyString,
	number_provided: z.number(),
	provided_by_talan: z.boolean(),
});

export const Transport = z.object({
	transport_mode: notEmptyString,
	average_journeys_per_month: z.number(),
	transport_distance: z.number(),
});

export const BusinessPropositionDataSchema = z.object({
	id_business_proposition_annotation: notEmptyString.optional(),
	id_business_proposition_file: notEmptyString.optional(),
	mission_name: notEmptyString.optional(),
	transports: z.array(Transport).optional(),
	computers: z.array(Computer).optional(),
	phones: z.array(Phone).optional(),
});

export const businessPropositionFileSchema = z.object({
	id_business_proposition_file: notEmptyString,
	file_name: notEmptyString,
	format: notEmptyString,
	confidential: z.boolean(),
	added_at: z.date(),
	file: z.any(),
});

export const userSchema = z.object({
	id: notEmptyString,
	roles: z.array(z.number()),
    first_name: notEmptyString,
    last_name: notEmptyString,
    id_manager: notEmptyString.optional(),
    first_name_manager: notEmptyString.optional(),
    last_name_manager: notEmptyString.optional()
});


export type BusinessPropositionData = z.infer<typeof BusinessPropositionDataSchema>;
export type BusinessPropositionFileData = z.infer<typeof businessPropositionFileSchema>;
export type Computer = z.infer<typeof Computer>;
export type Phone = z.infer<typeof Phone>;
export type Transport = z.infer<typeof Transport>;
export type User = z.infer<typeof userSchema>;

export interface PageResult<T> {
	page: number
	pageSize: number
	elements: T[]
	totalElements: number
}

export const PageResult = <T extends z.ZodTypeAny>(itemSchema: T) => z.object({
	page: z.number(),
	pageSize: z.number(),
	elements: z.array(itemSchema),
	totalElements: z.number(),
  });
