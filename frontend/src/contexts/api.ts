import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Store} from "react-notifications-component";
import {iNotification} from "react-notifications-component/dist/src/typings";
import {v4 as uuid} from 'uuid';
import {downloadFileFromResponse} from "../model/file.utils";
import {BusinessPropositionData, PageResult, SearchOptions, Template, TemplateForm} from "../model/models";
import {ApiContextI, TemplatesByType} from "./ApiContext";


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

    createBusinessProposition = (business_proposition: BusinessPropositionData): Promise<void> => {
        return notificationWrapper(
            this.axiosInstance.post(`business_proposition/`, business_proposition), {
                errorMessage: 'Error: cannot create business proposition',
                successMessage: 'Business proposition created'
            }
        );
    }


    readBusinessProposition = (businessPropositionID: string): Promise<[string]> => notificationWrapper(
        this.axiosInstance.get(`business_proposition/${businessPropositionID}`), {
            errorMessage: 'Error: cannot access business proposition'
        })

    updateBusinessProposition = (business_proposition: BusinessPropositionData): Promise<void> => notificationWrapper(
        this.axiosInstance.putForm(`business_proposition/${business_proposition.id}`, business_proposition), {
            errorMessage: 'Error: cannot update business proposition',
            successMessage: 'Business proposition updated'
        })

    deleteTemplate = (businessPropositionID: string): Promise<void> => notificationWrapper(
        this.axiosInstance.delete(`business_proposition/${businessPropositionID}`), {
            errorMessage: 'Error: cannot delete business proposition',
            successMessage: 'Business proposition deleted'
        })

    getReviewedAndUnderlings = (userID: string): Promise<[string]> => notificationWrapper(
        this.axiosInstance.get(`users/reviewed_and_underlings/${userID}`), {
            errorMessage: 'Erreur lors de la récupération des utilisateurs que vous pouvez évaluer'
        })
    
    getFullNameUser = (userID: string): Promise<string> => notificationWrapper(
        this.axiosInstance.get(`users/full_name/${userID}`), {
            errorMessage: 'Erreur lors de la récupération des données de l\'utilisateur'
        })

}

export default Api
