import FormBoxOffice from "../../components/formBox/FormBoxOffice";
import { FormStatus } from "../../model/simulationDataModel";
import styles from './SimulationForm.module.css';
import { useOutletContext } from "react-router-dom";
import classNames from 'classnames';
import { useLocation } from "react-router-dom";

function OfficeTab() {

    const { setDatat } = useOutletContext<{ setDatat: any }>();
    const location = useLocation();
    const formStatus = location.state?.status;
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
        <div className={classNames(styles.officeTab, (formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')} >
            <FormBoxOffice setValues={handleBoxDataReceive}></FormBoxOffice>
        </div>
    );
}
export default OfficeTab