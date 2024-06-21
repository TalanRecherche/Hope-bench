import {CVData, BaseModelWithComments} from "./models.ts";


const containsUnresolvedComments = (commModel: BaseModelWithComments) => {
	for(var c of commModel.comments){
		if(c.active){
			return true
		}
	}
	return false
}
export const isCvValid = (cv: CVData) => {
	return !(containsUnresolvedComments(cv.comm_general) || containsUnresolvedComments(cv.comm_languages) || containsUnresolvedComments(cv.comm_certifications)
        || containsUnresolvedComments(cv.comm_educations) || containsUnresolvedComments(cv.comm_skills))
}