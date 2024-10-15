import FormBoxMovement from "../../components/formBox/FormBoxMovement";
import FormMeansTransport from '../../components/FormMeansTransport';
import { useState } from "react";
import styles from './SimulationForm.module.css';
import { useOutletContext } from "react-router-dom";
import { FormStatus, MovementBoxData, InformationType } from "../../model/simulationDataModel";
import MovementTabStartingBox from "../../components/genericCustom/MovementTabStartingBox";
import classNames from 'classnames';
import { useLocation } from "react-router-dom";
import BoxSelectedList from "../../components/genericCustom/BoxSelectedList";

function MovementTab() {

    const { setDatat } = useOutletContext<{ setDatat: any }>(); // <-- access context value
    const location = useLocation();
    const formStatus = location.state?.status;
    const [movementDataValues] = useState<MovementBoxData[]>([]);
    const [movementInformationBase, setMovementInformationBase] = useState();

    let displayList: {
        id: string,
        name: string,
        checked: boolean,
        order: number
    }[] = [];

    const [x, setX] = useState(displayList);
    const handleSelectedListReceive = (data: any) => {

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

        var index = movementDataValues.findIndex(m => m.optionName == receivedData.optionName);
        if (index == -1) {
            movementDataValues.push(receivedData);
        }
        else {
            movementDataValues.splice(index, 1);
            movementDataValues.push(receivedData);
        }
        setDatat(movementDataValues);
    };

    const handleDefaultValues = (receivedValue: any) => {
        if (receivedValue != InformationType.needed)
            setX(displayList);
        setMovementInformationBase(receivedValue);
    };

    const isItemChecked = () => {
        return x?.filter(c => c.checked).length != 0;
    }

    return (
        <div style={{ display: "flex" }}>
            {isItemChecked() &&
                <div className={styles.movementTabSelectedListSection}>
                    <BoxSelectedList
                        title="Moyen(s) de transport utilisé(s)"
                        list={x?.filter(c => c.checked).sort((a, b) => a.order - b.order)} />
                </div>
            }

            <div className={classNames(isItemChecked() ? styles.movementTab2 : styles.movementTab, (formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')}>

                <MovementTabStartingBox sendMovementDefaultInformation={handleDefaultValues}></MovementTabStartingBox>

                {movementInformationBase == InformationType.needed &&
                    <>
                        <FormMeansTransport onDataSend={handleSelectedListReceive}></FormMeansTransport>

                        {x?.filter(c => c.checked).sort((a, b) => a.order - b.order).map((item, idx) => (
                            <FormBoxMovement
                                key={idx}
                                setBoxValues={handleBoxDataReceive}
                                options={{ name: item.name, type: 'text', id: item.id, placeholder: 'Description' }} />
                        ))}
                    </>
                }

            </div>
        </div>
    );
} export default MovementTab