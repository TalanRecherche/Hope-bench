import FormBoxGeneral from "../../components/FormBoxGeneral";

function GeneralTab() {
    return (
        <>
            <FormBoxGeneral
                isDefaultInformationSource={true}
                options={{ controlId: 'missionName', name: 'Titre de la mission', type: 'text', id: 'inputTitle', placeholder: 'Description' }} />

            <FormBoxGeneral
                isDefaultInformationSource={false}
                options={{ controlId: 'clientName', name: 'Nom du client', type: 'text', id: 'inputClientName', placeholder: 'lorem Ipsum' }} />

            <FormBoxGeneral
                isDefaultInformationSource={true}
                options={{ controlId: 'startDate', name: 'Date de début', type: 'date', id: 'inputStartDate', placeholder: 'date' }} />

            {/* ToDo - Nombre de collaborateurs */}

            <FormBoxGeneral
                isDefaultInformationSource={true}
                options={{ controlId: 'duration', name: 'Durée de la mission', type: 'duration', id: 'inputDuration', placeholder: 'Description' }} />

            <FormBoxGeneral
                isDefaultInformationSource={true}
                options={{ controlId: 'missionSector', name: 'Secteur Talan Concerné', type: 'text', id: 'inputSector', placeholder: 'Description' }} />

            {/* ToDo - Fied Title ? Ajout de documents */}
        </> 
    );
} export default GeneralTab