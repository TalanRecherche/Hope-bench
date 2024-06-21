import { createContext, PropsWithChildren, useContext } from "react";
import { config } from "../config";
import {CVData, PageResult, SearchOptions, Template, TemplateForm} from "../model/models";
import Api from "./api";
import { AuthContext } from "./AuthContext";

export type TemplatesByType = Record<string, Template[]>

export type ApiContextI = {
	listCvs: (options: SearchOptions) => Promise<PageResult<CVData>>,
	getCv: (id: string) => Promise<CVData>,
	deleteCv: (id: string) => Promise<void>,
	createCv: (data: CVData) => Promise<void>,
	updateCv: (data: CVData) => Promise<void>,
	defineAsMainCv: (data: CVData) => Promise<void>,
	updateStatusCV: (cv: CVData, new_status: number) => Promise<void>,
	generateCv: (cv: CVData, template: Template) => Promise<void>,
	generateCvCustomized: (cv: CVData, template: Template, cvCustomized?: CVData) => Promise<void>,
	importCv: (file: File) => Promise<CVData>,
	importCvWithNames: (firstname: string, lastname: string, file: File) => Promise<CVData>,
	listTemplates: () => Promise<Template[]>,
	getTemplate: (id: string) => Promise<Template>,
	deleteTemplate: (id: string) => Promise<void>,
	createTemplate: (data: TemplateForm) => Promise<void>,
	updateTemplate: (data: TemplateForm) => Promise<void>,
	listTemplatesByType: (active?: boolean) => Promise<TemplatesByType>,
	downloadTemplate: (data: Template, generate?: boolean) => Promise<void>,
	getReviewedAndUnderlings: (userID: string) => Promise<[string]>,
	getFullNameUser: (userID: string) => Promise<string>}

const notImplemented = () => Promise.reject("Not Implemented")

export const ApiContext = createContext<ApiContextI>({
	listCvs: notImplemented,
	getCv: notImplemented,
	deleteCv: notImplemented,
	createCv: notImplemented,
	defineAsMainCv: notImplemented,
	updateCv: notImplemented,
	updateStatusCV: notImplemented,
	generateCv: notImplemented,
	generateCvCustomized: notImplemented,
	importCv: notImplemented,
	importCvWithNames: notImplemented,
	listTemplates: notImplemented,
	getTemplate: notImplemented,
	deleteTemplate: notImplemented,
	createTemplate: notImplemented,
	updateTemplate: notImplemented,
	listTemplatesByType: notImplemented,
	downloadTemplate: notImplemented,
	getReviewedAndUnderlings: notImplemented,
	getFullNameUser: notImplemented,
});

export const ApiProvider = ({children}: PropsWithChildren) => {
	const {token} = useContext(AuthContext)
	const api = new Api(config.backendBaseUrl, token)
	return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}
