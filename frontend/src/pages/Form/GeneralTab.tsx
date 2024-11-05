import FormBoxGeneral from "../../components/formBox/FormBoxGeneral";
// import FormFileUpload from "../../components/FormFileUpload";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { FormBoxData, FormStatus, GeneralBoxData, InformationSourceData } from "../../model/simulationDataModel.ts";
import React from "react";
// import { useEffect }  from "react";

import styles from './SimulationForm.module.scss';
import classNames from 'classnames';
// import { useLocation } from "react-router-dom";
import { FormDataContext } from "./FormBase.tsx";

function GeneralTab() {

    //pour récupérer les données venant de Dashboard passé à cette page via navlink
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state; // Récupère les données passées

    console.log("formData generalTab",formData);
    
    const { datat, setDatat } = useOutletContext<FormDataContext>(); // <-- access context value

    // useEffect(() => {
    //     if (formData && !datat.formListData) {
    //         // Met à jour le contexte avec les données du formulaire
    //         setDatat((prev: any) => ({
    //             ...prev,
    //             formListData: {
    //                 name: formData.name,
    //                 format: formData.format,
    //                 numberOfPages: formData.numberOfPages,
    //                 lastUpdate: formData.lastUpdate,
    //                 status: formData.status,
    //             },
    //         }));
    //     }
    // }, [formData, setDatat]);

       // console.log("Valeurs reçues dans GeneralTab:", datat);

    const formStatus = datat?.formStatus;

    const initializeInformationSource = () => {
        const sourceData: InformationSourceData = {
            reliabilityRate: 0,
            foundOnPage: 0
        }
        return sourceData;
    };

    // console.log("initializeInformationSource", initializeInformationSource);

    const [generalData, setGeneralData] = React.useState<GeneralBoxData>({
       
        missionTitle: { id: "inputTitle", value: "", informationSource: initializeInformationSource() },
        clientName: { id: "inputClientName", value: "", informationSource: initializeInformationSource() },
        startDate: { id: "inputStartDate", value: "", informationSource: initializeInformationSource() },
        nbCollaborators: { id: "inputNbCollaborators", value: 0, informationSource: initializeInformationSource() },
        missionDuration: { id: "inputDuration", value: 0, informationSource: initializeInformationSource() },
        missionSector: { id: "inputSector", value: "", informationSource: initializeInformationSource() },

    });

    // console.log("Valeurs initiales de generalData:", generalData);

    // État pour les valeurs des champs
    // const [formValues, setFormValues] = React.useState({
    //     missionTitle: '',
    //     clientName: '',
    //     startDate: '',
    //     nbCollaborators: '',
    //     missionDuration: '',
    //     missionSector: ''
    // });


    // const [showMessage, setShowMessage] = React.useState(false);

    /* ToDo - handle Data Receive to be improved*/
    const handleDataReceive = (key: keyof GeneralBoxData, receivedData: FormBoxData<any>) => {
        // setDatat(initialData);
        const updatedData = {
            ...generalData,
            [key]: {
                ...generalData[key],
                ...receivedData
            },
        };

        // console.log("Données mises à jour dans handleDataReceive:", updatedData);

        setGeneralData(updatedData);
        setDatat(updatedData); // Met à jour le contexte avec les nouvelles données donc remonte les infos à FormBase

        // if (receivedData.id === "inputTitle") {
        //     setShowMessage(receivedData.value?.trim() !== "");
        // }
    };

    const handleNext = () => {
        // Logique pour passer à l'étape suivante
        // console.log("Données à la prochaine étape:", generalData);
        // console.log("formData bouton next",formData);

        navigate('/form/movementTab', {
            state: {
                name: formData.name,
                format: formData.format,
                numberOfPages: formData.numberOfPages,
                lastUpdate: formData.lastUpdate,
                status: formData.status,
                setCurrentEntry:"movementTab"
            }           
        });

        //const handleDataReceive = (receivedData: any) => {
        // console.log("data =", formStatus);

        // let initialData = generalData;

        // switch (receivedData.id) {
        //     case "inputTitle":
        //         initialData.missionTitle.value = receivedData.value;
        //         initialData.missionTitle.informationSource = receivedData.informationSourceData;
        //         break;
        //     case "inputClientName":
        //         initialData.clientName.value = receivedData.value;
        //         initialData.clientName.informationSource = receivedData.informationSourceData;
        //         break;
        //     case "inputStartDate":
        //         initialData.startDate.value = receivedData.value;
        //         initialData.startDate.informationSource = receivedData.informationSourceData;
        //         break;
        //     case "inputNbCollaborators":
        //         initialData.nbCollaborators.value = receivedData.value;
        //         initialData.nbCollaborators.informationSource = receivedData.informationSourceData;
        //         break;
        //     case "inputDuration":
        //         initialData.missionDuration.value = receivedData.value;
        //         initialData.missionDuration.informationSource = receivedData.informationSourceData;
        //         break;
        //     case "inputSector":
        //         initialData.missionSector.value = receivedData.value;
        //         initialData.missionSector.informationSource = receivedData.informationSourceData;
        // };
    };

    
    return (
        <div className={classNames(styles.generalTab, (formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')}>

            <FormBoxGeneral<string>
                setValues={data => handleDataReceive('missionTitle', data)}
                options={{
                    name: 'Titre de la mission',
                    type: 'text',
                    id: 'inputTitle',
                    placeholder: 'Fleet plan',
                    value: generalData.missionTitle.value // Mise à jour de l'état avec le texte saisi
                }}
                showSwitch={false} 
            />
            {/* {showMessage && (
                <div >
                    <p>Vous avez saisi : {generalData.missionTitle.value}</p>
                </div>
            )} */}

            <FormBoxGeneral
                setValues={data => handleDataReceive('clientName', data)}
                options={{
                    name: 'Nom du client',
                    type: 'text',
                    id: 'clientName',
                    placeholder: 'CMA CGM',
                    value: generalData.clientName.value
                }}
                showSwitch={false} 
            />

            <FormBoxGeneral
                setValues={data => handleDataReceive('startDate', data)}
                options={{
                    name: 'Date de début',
                    type: 'date',
                    id: 'inputStartDate',
                    placeholder: '09/12/2023',
                    value: generalData.startDate.value
                }}
                showSwitch={false} 
            />

            <div className={styles.durationContainer}>
                <FormBoxGeneral<number>
                setValues={data => handleDataReceive('missionDuration', data)}
                isNumericInput={true}
                    options={{
                        name: 'Durée de la mission',
                        subtitle: "Si l'information n'est pas présente mais qu'il existe des indices, je fais une supposition.",
                        type: 'number',
                        id: 'inputDuration',
                        placeholder: '14',
                        value: generalData.missionDuration.value,
                    }}
                    showSwitch={true} 
                />

            </div>

            <FormBoxGeneral<number>
                setValues={data => handleDataReceive('nbCollaborators', data)}
                isNumericInput={true}
                options={{
                    name: 'Nombre de collaborateurs sur la mission',
                    subtitle: "Si l'information n'est pas présente mais qu'il existe des indices, j'essaie de faire une estimation.",
                    type: 'number',
                    id: 'inputNbCollaborators',
                    placeholder: '3',
                    value: generalData.nbCollaborators.value
                }}
                showSwitch={false} 
            />

            <FormBoxGeneral
                setValues={data => handleDataReceive('missionSector', data)}
                options={{
                    name: 'Secteur Talan concerné',
                    type: 'select',
                    id: 'inputSector',
                    placeholder: 'Sélectionner',
                    optionsList: [
                        { value: 'secteur1', label: 'Secteur 1' },
                        { value: 'secteur2', label: 'Secteur 2' },
                        { value: 'secteur3', label: 'Secteur 3' }
                    ],
                    value: generalData.missionSector.value
                }}
                showSwitch={false} 
            />
            {/* ToDo - Finalize file upload */}
            {/* <br />
            <FormFileUpload></FormFileUpload> */}

            {/* Bouton Suivant */}
            <div className={styles.buttonContainer}>
                <button type="button" className={styles.nextButton} onClick={handleNext}>
                    Suivant
                </button>
            </div>
        </div>
    );
} export default GeneralTab;