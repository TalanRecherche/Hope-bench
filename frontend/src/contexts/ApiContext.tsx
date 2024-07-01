import { createContext, PropsWithChildren, useContext } from "react";
import { config } from "../config";
import {CVData, PageResult, SearchOptions, Template, TemplateForm} from "../model/models";
import Api from "./api";
import { AuthContext } from "./AuthContext";

export type TemplatesByType = Record<string, Template[]>

export type ApiContextI = {
    createBusinessProposition: (business_proposition: BusinessPropositionForm) => Promise<[string]>,
    readBusinessProposition: (businessPropositionID: string) => Promise<[string]>,
    updateBusinessProposition: (business_proposition: BusinessPropositionForm) => Promise<void>,
    deleteTemplate: (businessPropositionID: string) => Promise<void>,
	getReviewedAndUnderlings: (userID: string) => Promise<[string]>,
	getFullNameUser: (userID: string) => Promise<string>}

const notImplemented = () => Promise.reject("Not Implemented")

export const ApiContext = createContext<ApiContextI>({
	createBusinessProposition: notImplemented,
	readBusinessProposition: notImplemented,
	updateBusinessProposition: notImplemented,
	deleteTemplate: notImplemented,
	getReviewedAndUnderlings: notImplemented,
	getFullNameUser: notImplemented,
});

export const ApiProvider = ({children}: PropsWithChildren) => {
	const {token} = useContext(AuthContext)
	const api = new Api(config.backendBaseUrl, token)
	return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}
