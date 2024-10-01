import FormBoxOffice from "../../components/formBox/FormBoxOffice";
import { InformationSourceTypes } from "../../components/InformationSource";
import styles from './SimulationForm.module.css';
import { useOutletContext } from "react-router-dom";

function OfficeTab() {

    const { setDatat } = useOutletContext<{ setDatat: any }>();
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

    return (
        <div className={styles.officeTab} >
            <FormBoxOffice setValues={handleBoxDataReceive} informationSourceType={InformationSourceTypes.fromCollaborator}></FormBoxOffice>
        </div>
    );
}
export default OfficeTab