import { createContext, PropsWithChildren, useContext } from "react";
import { config } from "../config";
import {PageResult, BusinessPropositionFileData, BusinessPropositionData} from "../model/models";
import Api from "./api";
import { AuthContext } from "./AuthContext";

export type ApiContextI = {
	createBusinessProposition: (business_proposition: BusinessPropositionData) => Promise<[string]>,
	readBusinessProposition: (businessPropositionID: string) => Promise<[string]>,
	updateBusinessProposition: (business_proposition: BusinessPropositionData) => Promise<void>,
	deleteTemplate: (businessPropositionID: string) => Promise<void>,
	getReviewedAndUnderlings: (userID: string) => Promise<[string]>,
	getFullNameUser: (userID: string) => Promise<string>,
	readBusinessPropositionFile: (businessPropositionFileID: string) => Promise<[string]>,
	getBusinessPropositionFile: (currentPage: number, pageSize: number) => Promise<PageResult<BusinessPropositionFileData>>
}

const notImplemented = () => Promise.reject("Not Implemented")

export const ApiContext = createContext<ApiContextI>({
	createBusinessProposition: notImplemented,
	readBusinessProposition: notImplemented,
	updateBusinessProposition: notImplemented,
	deleteTemplate: notImplemented,
	getReviewedAndUnderlings: notImplemented,
	getFullNameUser: notImplemented,
	readBusinessPropositionFile: notImplemented,
	getBusinessPropositionFile: notImplemented
});

export const ApiProvider = ({children}: PropsWithChildren) => {
	const {token} = useContext(AuthContext)
	const api = new Api(config.backendBaseUrl, token)
	return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}
