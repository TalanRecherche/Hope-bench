import FormBoxGeneral from "../../components/FormBoxGeneral";
import FormFileUpload from "../../components/FormFileUpload";

function GeneralTab() {
    return (
        <>
            <FormBoxGeneral                
                options={{ controlId: 'missionName', name: 'Titre de la mission', type: 'text', id: 'inputTitle', placeholder: 'Description' }} />

            <FormBoxGeneral
                isDefaultInformationSource={false}
                options={{ controlId: 'clientName', name: 'Nom du client', type: 'text', id: 'inputClientName', placeholder: 'lorem Ipsum' }} />

            <FormBoxGeneral
                options={{ controlId: 'startDate', name: 'Date de début', type: 'date', id: 'inputStartDate', placeholder: 'date' }} />

            <FormBoxGeneral     
                isNumericInput={true}           
                options={{ controlId: 'nbCollaborators', name: 'Nombre de collaborateurs sur la mission', type: 'number', id: 'inputbCollaborators', placeholder: '' }} />

            <FormBoxGeneral
                options={{ controlId: 'duration', name: 'Durée de la mission', type: 'duration', id: 'inputDuration', placeholder: 'Description' }} />

            <FormBoxGeneral
                options={{ controlId: 'missionSector', name: 'Secteur Talan Concerné', type: 'text', id: 'inputSector', placeholder: 'Description' }} />

            {/* ToDo - Finalize file upload */}
            <FormFileUpload></FormFileUpload>
        </> 
    );
} export default GeneralTab