import FormBoxGeneral from "../../components/formBox/FormBoxGeneral";
import FormFileUpload from "../../components/FormFileUpload";
import { useOutletContext } from "react-router-dom";
import { FormStatus, GeneralBoxData, InformationSourceData } from "../../model/simulationDataModel.ts";
import React from "react";
import styles from './SimulationForm.module.css';
import classNames from 'classnames';
import { useLocation } from "react-router-dom";

function GeneralTab() {

    const { setDatat } = useOutletContext<{ setDatat: any }>(); // <-- access context value
    const location = useLocation();
    const formStatus = location.state?.status;

    const initializeInformationSource = () => {
        const sourceData: InformationSourceData = {
            foundInClientDocument: false,
            deduceByReadingDocument: false,
            personalKnowlegdeUsed: false,
            enrichedFromDocument: false,
            reliabilityRate: 0,
            foundOnPage: 0
        }
        return sourceData;
    }

    const [generalData] = React.useState<GeneralBoxData>({
        missionTitle: {
            id: "inputTitle",
            informationSource: initializeInformationSource()
        },
        clientName: {
            id: "inputClientName",
            informationSource: initializeInformationSource()
        },
        startDate: {
            id: "inputStartDate",
            informationSource: initializeInformationSource()
        },
        nbCollaborators: {
            id: "inputNbCollaborators",
            informationSource: initializeInformationSource()
        },
        missionDuration: {
            id: "inputDuration",
            informationSource: initializeInformationSource()
        },
        missionSector: {
            id: "inputSector",
            informationSource: initializeInformationSource()
        },
    });   

    /* ToDo - handle Data Receive to be improved*/
    const handleDataReceive = (receivedData: any) => {
        //console.log("data =", formStatus);

        let initialData = generalData;

        switch (receivedData.id) {
            case "inputTitle":
                initialData.missionTitle.value = receivedData.value;
                initialData.missionTitle.informationSource = receivedData.informationSourceData;
                break;
            case "inputClientName":
                initialData.clientName.value = receivedData.value;
                initialData.clientName.informationSource = receivedData.informationSourceData;
                break;
            case "inputStartDate":
                initialData.startDate.value = receivedData.value;
                initialData.startDate.informationSource = receivedData.informationSourceData;
                break;
            case "inputNbCollaborators":
                initialData.nbCollaborators.value = receivedData.value;
                initialData.nbCollaborators.informationSource = receivedData.informationSourceData;
                break;
            case "inputDuration":
                initialData.missionDuration.value = receivedData.value;
                initialData.missionDuration.informationSource = receivedData.informationSourceData;
                break;
            case "inputSector":
                initialData.missionSector.value = receivedData.value;
                initialData.missionSector.informationSource = receivedData.informationSourceData;
        };       

        setDatat(initialData);
    };
    return (
        <div className={classNames(styles.generalTab, (formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')}>
            <FormBoxGeneral
                setValues={handleDataReceive}
                options={{ name: 'Titre de la mission', type: 'text', id: 'inputTitle', placeholder: 'Description' }} />

            <FormBoxGeneral
                setValues={handleDataReceive}
                options={{ name: 'Nom du client', type: 'text', id: 'inputClientName', placeholder: 'Description' }} />

            <FormBoxGeneral
                setValues={handleDataReceive}
                options={{ name: 'Date de début', type: 'date', id: 'inputStartDate', placeholder: 'Date' }} />

            <FormBoxGeneral
                setValues={handleDataReceive}
                isNumericInput={true}
                options={{ name: 'Nombre de collaborateurs sur la mission', type: 'number', id: 'inputNbCollaborators', placeholder: '' }} />

            <FormBoxGeneral
                setValues={handleDataReceive}
                options={{ name: 'Durée de la mission', type: 'duration', id: 'inputDuration', placeholder: 'Description' }} />

            <FormBoxGeneral
                setValues={handleDataReceive}
                options={{ name: 'Secteur Talan Concerné', type: 'text', id: 'inputSector', placeholder: 'Description' }} />

            {/* ToDo - Finalize file upload */}
            <br />
            <FormFileUpload></FormFileUpload>
        </div>
    );   
} export default GeneralTab