import { z } from "zod";

const notEmptyString = z.string().trim().min(1)



export const commentsSchema = z.object({
	date: notEmptyString,
    content: notEmptyString,
    active: z.boolean(),
    dateSolve: z.string().optional(), 
	author: notEmptyString
});

export const baseModelWithCommentsSchema = z.object({
	comments: z.array(commentsSchema)
});

export const commentDictSchema = z.object({
	comm_general: baseModelWithCommentsSchema
});

export const propalDataSchema = commentDictSchema.extend({
	id: notEmptyString.optional(),
	status: z.number(),
	label: notEmptyString,
	id_user: notEmptyString.optional(),
});

export const templateFormSchema = z.object({
	id: notEmptyString.optional(),
	name: notEmptyString,
	file: z.any().optional(),
	active: z.boolean()
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

export const searchOptionsSchema = z.object({
	userId: z.string().optional(),
	searchString: z.string().optional(),
	selfSearch: z.boolean().optional(),
    limitToAllowedCv:z.boolean().optional(),
    statusToCheck: z.array(z.number()).optional(),
    onlyMainCv: z.boolean().optional(),
	page: z.number().optional(),
	pageSize: z.number().optional()
})

export type TemplateForm = z.infer<typeof templateFormSchema>;

export type propalData = z.infer<typeof propalDataSchema>;
export type User = z.infer<typeof userSchema>;
export type BaseModelWithComments = z.infer<typeof baseModelWithCommentsSchema>;
export type Comment = z.infer<typeof commentsSchema>;

export type SearchOptions = z.infer<typeof searchOptionsSchema>;

export interface PageResult<T> {
	page: number
	pageSize: number
	elements: T[]
	totalElements: number
}

// const PageResult = <T extends z.ZodTypeAny>(itemSchema: T) => z.object({
// 	page: z.number(),
// 	pageSize: z.number(),
// 	elements: z.array(itemSchema),
// 	totalElements: z.number(),
//   });
export const PageResult = <T extends z.ZodTypeAny>(itemSchema: T) => z.object({
	page: z.number(),
	pageSize: z.number(),
	elements: z.array(itemSchema),
	totalElements: z.number(),
  });



export interface Template {
	id: string
	name: string
	type: string
	fileName: string
	active: boolean
}

export function has_no_unresolved_comments(elem: BaseModelWithComments){
	for(var c of elem.comments){
		if(c.active){
			return false;
		}
	}
	return true;
}

export function cv_has_no_unresolved_comments(cv: propalData){
	for(var m of cv.missions){
		if(!has_no_unresolved_comments(m)){
			return false;
		}
	}

	return has_no_unresolved_comments(cv.comm_general) && has_no_unresolved_comments(cv.comm_educations) &&
		has_no_unresolved_comments(cv.comm_languages) && has_no_unresolved_comments(cv.comm_certifications) && has_no_unresolved_comments(cv.comm_skills);
}
