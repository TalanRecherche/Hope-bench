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
	comm_languages: baseModelWithCommentsSchema,
	comm_certifications: baseModelWithCommentsSchema,
	comm_educations: baseModelWithCommentsSchema,
	comm_skills: baseModelWithCommentsSchema,
	comm_general: baseModelWithCommentsSchema
});

export const missionSchema = baseModelWithCommentsSchema.extend({
	startDate: z.string(),
	endDate: z.string().optional(),
	company: notEmptyString,
	poste: notEmptyString,
	description: notEmptyString,
	tasks: z.array(notEmptyString),
	skills: z.array(notEmptyString), 
	location: z.string().optional()
});

export const languageSchema = z.object({
	name: notEmptyString,
	level: notEmptyString
});

export const educationSchema = z.object({
	name: notEmptyString,
	year: z.number()
});


export const certificationSchema = z.object({
	name: notEmptyString,
	date: z.string()
});

export const skillsSchema = z.object({
	domain: notEmptyString,
	skills: z.array(notEmptyString).min(1)
});

export const cvLabelsSchema = z.object({
	bulletForLanguageLevels: z.boolean(),
    noSkillDomains: z.boolean(),
    noCertifications: z.boolean(),
    anonymized: z.boolean(),
    noIntroduction: z.boolean(),
    englishCV: z.boolean(),
});

export const cvDataSchema = commentDictSchema.extend({
	id: notEmptyString.optional(),
	firstname: notEmptyString,
	lastname: notEmptyString,
	poste: notEmptyString,
	introduction: notEmptyString,
	missions: z.array(missionSchema),
	languages: z.array(languageSchema),
	educations: z.array(educationSchema),
	certifications: z.array(certificationSchema),
	skills: z.array(skillsSchema).refine(
			(val) => {
				const domains = val.map(v=>v.domain);
				return domains.length == new Set(domains).size;
			}, {
			message: "Domains must be unique",
		}),
	status: z.number(),
	label: notEmptyString,
	primary_cv: z.boolean(),
	id_user: notEmptyString.optional(),
	labelsAnnotation: cvLabelsSchema,
	originalFormat: notEmptyString,
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

export type CVData = z.infer<typeof cvDataSchema>;
export type CVLabels = z.infer<typeof cvLabelsSchema>;
export type Mission = z.infer<typeof missionSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Skill = z.infer<typeof skillsSchema>;
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

export function cv_has_no_unresolved_comments(cv: CVData){
	for(var m of cv.missions){
		if(!has_no_unresolved_comments(m)){
			return false;
		}
	}

	return has_no_unresolved_comments(cv.comm_general) && has_no_unresolved_comments(cv.comm_educations) &&
		has_no_unresolved_comments(cv.comm_languages) && has_no_unresolved_comments(cv.comm_certifications) && has_no_unresolved_comments(cv.comm_skills);
}
