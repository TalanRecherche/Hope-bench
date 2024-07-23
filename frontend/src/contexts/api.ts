import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Store} from "react-notifications-component";
import {iNotification} from "react-notifications-component/dist/src/typings";
import {BusinessPropositionData as BusinessPropositionAnnotationData, BusinessPropositionFileData, PageResult} from "../model/models";
import {ApiContextI} from "./ApiContext";


interface FetcherOptions<T> {
    successCallback?: (res: AxiosResponse<T>) => Promise<T> | T
    successMessage?: string
    errorMessage?: string
}

export const notifConfig: iNotification = {
    container: 'top-right',
    dismiss: {
        duration: 5000
    }
}

const notificationWrapper = <T, >(promise: Promise<AxiosResponse<T>>, options: FetcherOptions<T>): Promise<T> =>
    promise.then(async (res: AxiosResponse<T>) => {
        if (options.successMessage) {
            Store.addNotification({
                ...notifConfig,
                title: options.successMessage,
                type: "success"
            })
        }
        return options.successCallback ? options.successCallback(res) : res.data
    }).catch(e => {
        console.error(e)
        Store.addNotification({
            ...notifConfig,
            dismiss: {
                duration: 10000
            },
            title: options.errorMessage || 'Erreur inconnue',
            type: "danger"
        })
        // re-throw error for custom handling
        throw e;
    })


class Api implements ApiContextI {
    private axiosInstance: AxiosInstance;

    constructor(backendUrl: string, token: string) {
        // TODO fix type mismatch ??
        // @ts-ignore
        this.axiosInstance = axios.create({
            baseURL: backendUrl,
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            // remove bracket from array params, not compatible with fastApi
            paramsSerializer: { indexes: null }
        })
    }

    createBusinessProposition = (business_proposition_annotation: BusinessPropositionAnnotationData): Promise<[string]> => {
        return notificationWrapper(
            this.axiosInstance.post(`business_proposition_annotation/`, business_proposition_annotation), {
                errorMessage: 'Error: cannot create business proposition annotation',
                successMessage: 'Business proposition annotated'
            }
        );
    }


    readBusinessProposition = (businessPropositionAnnotationID: string): Promise<[string]> => notificationWrapper(
        this.axiosInstance.get(`business_proposition_annotation/${businessPropositionAnnotationID}`), {
            errorMessage: 'Error: cannot access business proposition annotation'
        })

    updateBusinessProposition = (business_proposition_annotation: BusinessPropositionAnnotationData): Promise<void> => notificationWrapper(
        this.axiosInstance.putForm(`business_proposition_annotation/${business_proposition_annotation.id_business_proposition_annotation}`, business_proposition_annotation), {
            errorMessage: 'Error: cannot update business proposition',
            successMessage: 'Business proposition updated'
        })

    deleteTemplate = (businessPropositionAnnotationID: string): Promise<void> => notificationWrapper(
        this.axiosInstance.delete(`business_proposition_annotation/${businessPropositionAnnotationID}`), {
            errorMessage: 'Error: cannot delete business proposition annotation',
            successMessage: 'Business proposition annotation deleted'
        })

    getReviewedAndUnderlings = (userID: string): Promise<[string]> => notificationWrapper(
        this.axiosInstance.get(`users/reviewed_and_underlings/${userID}`), {
            errorMessage: 'Erreur lors de la récupération des utilisateurs que vous pouvez évaluer'
        })
    
    getFullNameUser = (userID: string): Promise<string> => notificationWrapper(
        this.axiosInstance.get(`users/full_name/${userID}`), {
            errorMessage: 'Erreur lors de la récupération des données de l\'utilisateur'
        })

    readBusinessPropositionFile = (businessPropositionFileID: string): Promise<[string]> => notificationWrapper(
        this.axiosInstance.get(`business_proposition_file/${businessPropositionFileID}`), {
            errorMessage: 'Error: cannot access business proposition file'
        })

    getBusinessPropositionFile = (currentPage: number, pageSize: number): Promise<PageResult<BusinessPropositionFileData>> => notificationWrapper(
        this.axiosInstance.get(`business_proposition_file/paginated`, {params: {page: currentPage, pageSize}}), {
            errorMessage: 'Error: cannot access business proposition file'
        })

}

export default Api
