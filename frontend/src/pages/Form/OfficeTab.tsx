import FormBoxOffice from "../../components/formBox/FormBoxOffice";
import { FormStatus, InformationType } from "../../model/simulationDataModel";
import styles from './SimulationForm.module.scss';
import { useOutletContext } from "react-router-dom";
import classNames from 'classnames';
import { useLocation } from "react-router-dom";
import OfficeTabStartingBox from "../../components/OfficeTabStartingBox";
import { useState } from "react";

function OfficeTab() {

    const { setDatat } = useOutletContext<{ setDatat: any }>();
    const location = useLocation();
    const formStatus = location.state?.status;
    const [officeInformationBase, setOfficeInformationBase] = useState();
    
    // const [officeDataValues] = useState<OfficeBoxData[]>([]);

    const handleBoxDataReceive = (receivedData: any) => {

        // var index = movementValues.findIndex(m => m.optionName == receivedData.optionName);
        // if (index == -1) {
        //     movementValues.push(receivedData);
        // }
        // else {
        //     movementValues.splice(index, 1);
        //     movementValues.push(receivedData);
        // }
        setDatat(receivedData);
    };

    const handleDefaultValues = (receivedValue: any) => {
        setOfficeInformationBase(receivedValue);
    };

    return (
        <div className={classNames(styles.officeTab, (formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')} >
            <OfficeTabStartingBox sendDigitalDefaultInformation={handleDefaultValues}></OfficeTabStartingBox>

            {officeInformationBase == InformationType.needed &&
                <FormBoxOffice setValues={handleBoxDataReceive}></FormBoxOffice>
            }

            {/* Conteneur pour les boutons suivant et précédent */}
            <div className={styles.buttonContainer}>
                    <button type="button" className={styles.nextButton} >
                        Précédent
                    </button>
                   
                </div>
        </div>
    );
}
export default OfficeTab