import FormDigitalEquipments from '../../components/FormDigitalEquipments';
import FormBoxDigital from '../../components/formBox/FormBoxDigital';
import { useState } from 'react';
import styles from './SimulationForm.module.css';
import { DigitalBoxData, FormStatus, InformationType } from '../../model/simulationDataModel';
import { useOutletContext } from 'react-router-dom';
import classNames from 'classnames';
import { useLocation } from "react-router-dom";
import DigitalTabStartingBox from '../../components/genericCustom/DigitalTabStartingBox';
import BoxSelectedList from '../../components/genericCustom/BoxSelectedList';

function DigitalTab() {

    const { setDatat } = useOutletContext<{ setDatat: any }>();
    const location = useLocation();
    const formStatus = location.state?.status;
    const [digitalValues] = useState<DigitalBoxData[]>([]);
    const [digitalInformationBase, setDigitalInformationBase] = useState();


    let initialList: {
        id: string,
        name: string,
        checked: boolean,
        order: number
    }[] = [];

    const [x, setX] = useState(initialList);
    const handleDataReceive = (data: any) => {

        setX(x => {
            if (data[0].checked) {
                x = x.concat(data);
            }
            else {
                let value = x.find(l => l.id == data[0].id);

                if (value) {
                    var index = x.indexOf(value);
                    if (index !== -1) {
                        x = x.splice(index, 1);
                    }
                }
            }

            return x;
        });
    };

    const handleBoxDataReceive = (receivedData: any) => {

        var index = digitalValues.findIndex(m => m.optionName == receivedData.optionName);
        if (index == -1) {
            digitalValues.push(receivedData);
        }
        else {
            digitalValues.splice(index, 1);
            digitalValues.push(receivedData);
        }
        setDatat(digitalValues);
    };

    const handleDefaultValues = (receivedValue: any) => {
        if (receivedValue != InformationType.needed)
            setX(initialList);
        setDigitalInformationBase(receivedValue);
    };

    const isItemChecked = () => {
        return x?.filter(c => c.checked).length != 0;
    }

    return (
        <div style={{ display: "flex" }}>
            {isItemChecked() &&
                <div className={styles.movementTabSelectedListSection}>
                    <BoxSelectedList
                        title="Equipements numérique(s) utilisé(s)"
                        list={x?.filter(c => c.checked).sort((a, b) => a.order - b.order)} />
                </div>
            }

            <div className={classNames(isItemChecked() ? styles.movementTab2 : styles.movementTab, (formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')}>
                <DigitalTabStartingBox sendDigitalDefaultInformation={handleDefaultValues}></DigitalTabStartingBox>

                {digitalInformationBase == InformationType.needed &&
                    <>
                        <FormDigitalEquipments onDataSend={handleDataReceive}></FormDigitalEquipments>

                        {x?.filter(c => c.checked).sort((a, b) => a.order - b.order).map((item, idx) => (
                            <FormBoxDigital
                                key={idx}
                                setValues={handleBoxDataReceive}
                                options={{ name: item.name, type: 'text', id: item.id, placeholder: 'Description' }} />
                        ))}

                    </>
                }
            </div>
        </div>
    );
} export default DigitalTab