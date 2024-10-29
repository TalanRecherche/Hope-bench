import FormBoxGeneral from "../../components/formBox/FormBoxGeneral";
import FormFileUpload from "../../components/FormFileUpload";
import { useOutletContext } from "react-router-dom";
import { FormStatus, GeneralBoxData, InformationSourceData } from "../../model/simulationDataModel.ts";
import React from "react";
import styles from './SimulationForm.module.scss';
import classNames from 'classnames';
import { useLocation } from "react-router-dom";

function GeneralTab() {

    const { setDatat } = useOutletContext<{ setDatat: any }>(); // <-- access context value
    const location = useLocation();
    console.log("Valeurs reçues:", location.state);

    const formStatus = location.state?.status;

    const initializeInformationSource = () => {
        const sourceData: InformationSourceData = {
            reliabilityRate: 0,
            foundOnPage: 0
        }
        return sourceData;
    };
    console.log("initializeInformationSource", initializeInformationSource);

    const [generalData, setGeneralData] = React.useState<GeneralBoxData>({
        // missionTitle: {
        //     id: "inputTitle",
        //     informationSource: initializeInformationSource()
        // },
        // clientName: {
        //     id: "inputClientName",
        //     informationSource: initializeInformationSource()
        // },
        // startDate: {
        //     id: "inputStartDate",
        //     informationSource: initializeInformationSource()
        // },
        // nbCollaborators: {
        //     id: "inputNbCollaborators",
        //     informationSource: initializeInformationSource()
        // },
        // missionDuration: {
        //     id: "inputDuration",
        //     informationSource: initializeInformationSource()
        // },
        // missionSector: {
        //     id: "inputSector",
        //     informationSource: initializeInformationSource()
        // },
        missionTitle: { id: "inputTitle", value: "", informationSource: initializeInformationSource() },
        clientName: { id: "inputClientName", value: "", informationSource: initializeInformationSource() },
        startDate: { id: "inputStartDate", value: "", informationSource: initializeInformationSource() },
        nbCollaborators: { id: "inputNbCollaborators", value: "", informationSource: initializeInformationSource() },
        missionDuration: { id: "inputDuration", value: "", informationSource: initializeInformationSource() },
        missionSector: { id: "inputSector", value: "", informationSource: initializeInformationSource() },

    });

    console.log("Valeurs initiales de generalData:", generalData);

    const [showMessage, setShowMessage] = React.useState(false);

    /* ToDo - handle Data Receive to be improved*/
    const handleDataReceive = (receivedData: { id: keyof GeneralBoxData; value: string; informationSourceData?: InformationSourceData }) => {

        console.log("ID reçu :", receivedData.id);
        console.log("Valeur reçue :", receivedData.value);


        console.log("generalData[receivedData.id]", generalData[receivedData.id]);
        // setDatat(initialData);
        const updatedData = {
            ...generalData,
            [receivedData.id]: {
                ...generalData[receivedData.id],
                value: receivedData.value,
                informationSource: receivedData.informationSourceData,
            },
        };

        console.log("Données mises à jour dans handleDataReceive:", updatedData);
        setGeneralData(updatedData);
        setDatat(updatedData); // Met à jour le contexte avec les nouvelles données donc remonte les infos à FormBase

        if (receivedData.id === "inputTitle" as keyof GeneralBoxData) {
            setShowMessage(receivedData.value.trim() !== "");
        }
    };

    const handleNext = () => {
        // Logique pour passer à l'étape suivante
        console.log("Données à la prochaine étape:", generalData);

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

            <FormBoxGeneral
                setValues={handleDataReceive}
                options={{
                    name: 'Titre de la mission',
                    type: 'text',
                    id: 'inputTitle',
                    placeholder: 'Fleet plan',
                    value: generalData.missionTitle.value, // Mise à jour de l'état avec le texte saisi
                }}
            />
            {showMessage && (
                <div >
                    <p>Vous avez saisi : {generalData.missionTitle.value}</p>
                </div>
            )}

            <FormBoxGeneral
                setValues={handleDataReceive}
                options={{
                    name: 'Nom du client',
                    type: 'text',
                    id: 'clientName',
                    placeholder: 'CMA CGM',
                    value: generalData.clientName.value
                }}
            />

            <FormBoxGeneral
                setValues={handleDataReceive}
                options={{
                    name: 'Date de début',
                    type: 'date',
                    id: 'inputStartDate',
                    placeholder: '09/12/2023',
                    value: generalData.startDate.value
                }}
            />

            <FormBoxGeneral
                setValues={handleDataReceive}
                options={{
                    name: 'Durée de la mission',
                    subtitle:"Si l'information n'est pas présente mais qu'il existe des indices, je fais une supposition.",
                    type: 'duration',
                    id: 'inputDuration',
                    placeholder: '14 mois',
                    value: generalData.missionDuration.value
                }}
            />

            <FormBoxGeneral
                setValues={handleDataReceive}
                isNumericInput={true}
                options={{
                    name: 'Nombre de collaborateurs sur la mission',
                    subtitle:"Si l'information n'est pas présente mais qu'il existe des indices, j'essaie de faire une estimation.",
                    type: 'number',
                    id: 'inputNbCollaborators',
                    placeholder: '3',
                    value: generalData.nbCollaborators.value
                }}
            />

            <FormBoxGeneral
                setValues={handleDataReceive}
                options={{
                    name: 'Secteur Talan Concerné',
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