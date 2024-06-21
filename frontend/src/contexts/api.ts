import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Store} from "react-notifications-component";
import {iNotification} from "react-notifications-component/dist/src/typings";
import {v4 as uuid} from 'uuid';
import {downloadFileFromResponse} from "../model/file.utils";
import {CVData, PageResult, SearchOptions, Template, TemplateForm} from "../model/models";
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

    listTemplates = (active?: boolean): Promise<Template[]> => notificationWrapper(
        this.axiosInstance.get<Template[]>(`templates`, {
            params: {active}
        }), {
            errorMessage: 'Erreur lors de la récupération des templates'
        })

    getTemplate = (id: string): Promise<Template> => notificationWrapper(
        this.axiosInstance.get<Template>(`templates/${id}`), {
            errorMessage: 'Erreur lors de la récupération du template'
        })

    deleteTemplate = (id: string): Promise<void> => notificationWrapper(
        this.axiosInstance.delete(`templates/${id}`), {
            errorMessage: 'Erreur lors de la suppression du template',
            successMessage: 'Template supprimé'
        })

    createTemplate = (template: TemplateForm): Promise<void> => notificationWrapper(
        this.axiosInstance.postForm(`templates`, {...template, id: uuid()}), {
            errorMessage: 'Erreur lors de la création du template',
            successMessage: 'Template créé'
        })

    updateTemplate = (template: TemplateForm): Promise<void> => notificationWrapper(
        this.axiosInstance.putForm(`templates/${template.id}`, template), {
            errorMessage: 'Erreur lors de la sauvegarde du template',
            successMessage: 'Template sauvegardé'
        })

    downloadTemplate = (template: Template, generate?: boolean): Promise<void> => notificationWrapper(
        this.axiosInstance.get(`templates/${template.id}/download`, {
            responseType: 'blob', params: {generate}
        }), {
            successCallback: res => downloadFileFromResponse(res, template.fileName)
        })

    listTemplatesByType = (active?: boolean): Promise<TemplatesByType> => this.listTemplates(active).then(
        templates => templates.reduce((acc, t) => {
            acc[t.type] = (acc[t.type] || [])
            acc[t.type].push(t)
            return acc;
        }, {} as TemplatesByType)
    )

    listCvs = (options: SearchOptions): Promise<PageResult<CVData>> => notificationWrapper(
        this.axiosInstance.get('cvs/search', {
            params: options
        }), {
            errorMessage: 'Erreur lors de la récupération des CVs'
        })

    getCv = (id: string): Promise<CVData> => notificationWrapper(
        this.axiosInstance.get(`cvs/${id}`), {
            errorMessage: 'Erreur lors de la récupération du CV'
        })

    deleteCv = (id: string): Promise<void> => notificationWrapper(
        this.axiosInstance.delete(`cvs/${id}`), {
            errorMessage: 'Erreur lors de la suppression du CV',
            successMessage: 'CV supprimé'
        })

    createCv = (cv: CVData): Promise<void> => notificationWrapper(
        this.axiosInstance.post(`cvs`, cv), {
            errorMessage: 'Erreur lors de la création du CV',
            successMessage: 'CV créé'
        })

    defineAsMainCv = (cv: CVData): Promise<void> => notificationWrapper(
        this.axiosInstance.put(`cvs/${cv.id}/principal`), {
            errorMessage: 'Erreur lors de la définition du CV comme principal',
            successMessage: 'CV défini comme principal'
        })

    updateCv = (cv: CVData): Promise<void> => notificationWrapper(
        this.axiosInstance.put(`cvs/${cv.id}`, cv), {
            errorMessage: 'Erreur lors de la sauvegarde du CV',
            successMessage: 'CV sauvegardé'
        })

    // updateStatusCV = (cv_id: string | undefined, status: number): Promise<void> => (cv_id ? notificationWrapper(
    //     this.axiosInstance.put(`cvs/${cv_id}/status/${status}`), {
    //         errorMessage: 'Erreur lors de la sauvegarde du statut du CV',
    //         successMessage: 'Statut du CV sauvegardé'
    //     }) : Store.addNotification({
    //         ...notifConfig,
    //         dismiss: {
    //             duration: 10000
    //         },
    //         title: 'Erreur update status CV : Pas d\ID pour ce CV.',
    //         type: "danger"
    //     })
    // )

    updateStatusCV = (cv: CVData , status: number): Promise<void> => notificationWrapper(
        this.axiosInstance.put(`cvs/${cv.id}/status/${status}`), {
            errorMessage: 'Erreur lors de la sauvegarde du statut du CV',
            successMessage: 'Statut du CV sauvegardé'
        })
    

    generateCv = (cv: CVData, template: Template): Promise<void> =>{
        return notificationWrapper(
            this.axiosInstance.post(`cvs/generate/${template.id}`, cv,  {
                withCredentials: true,
                responseType: 'blob'
            }), {
                successCallback: res => downloadFileFromResponse(res, 'cv.' + template.type.toLowerCase())
            }
        );
    } 

    // generateCvCustomizedOld = (cv: CVData, template: Template): Promise<void> =>{
    //     console.log("TestV2");
    //     console.log(cv.id);
    //     return notificationWrapper(
    //         this.axiosInstance.get(`cvs/generate/${template.id}/`, {
    //             params: cv, // Include CVData object as query parameters
    //             withCredentials: true,
    //             responseType: 'blob'
    //         }), {
    //             successCallback: res => downloadFileFromResponse(res, 'cv.' + template.type.toLowerCase())
    //         }
    //     );
    // }

    generateCvCustomized = (cv: CVData, template: Template): Promise<void> => {
        return notificationWrapper(
            this.axiosInstance.post(`cvs/generate/${template.id}`, cv,  {
                withCredentials: true,
                responseType: 'blob'
            }), {
                successCallback: res => downloadFileFromResponse(res, 'cv.' + template.type.toLowerCase())
            }
        );
    }; 

    importCv = (file: File): Promise<CVData> => notificationWrapper(
        this.axiosInstance.postForm(`cvs/parse`, {file: file}), {
            errorMessage: 'Erreur lors de l\'import du CV',
            successMessage: 'CV importé'
        })

    // importCvWithNames = (firstname: string, lastname: string, file: File): Promise<CVData> => notificationWrapper(
    //     this.axiosInstance.get(`cvs/parse`, {
    //         params: {file, lastname, firstname}
    //     }), {
    //         errorMessage: 'Erreur lors de l\'import du CV',
    //         successMessage: 'CV importé'
    //     })

    importCvWithNames = (firstname: string, lastname: string, file: File) => {
            const formData = new FormData(); // Using FormData for multipart/form-data
            formData.append('file', file);  // Append the file
            formData.append('firstname', firstname);  // Append additional data
            formData.append('lastname', lastname);
            const config = {
                headers: {
                  'Content-Type': 'multipart/form-data', // Set Content-Type to multipart/form-data
                },
              };
        
            return this.axiosInstance.post('cvs/parse', formData, config)  // Send as multipart/form-data
                .then((response: any) => {
                console.log('Success:', response.data);
                return response.data;
                })
                .catch((error: any) => {
                console.error('Error:', error);
                throw error;
                });
        
        }
        
        

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
