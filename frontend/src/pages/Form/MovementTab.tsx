import FormBoxMovement from "../../components/formBox/FormBoxMovement";
import FormMeansTransport from '../../components/FormMeansTransport';
import { InformationSourceTypes } from "../../components/InformationSource";
import { useState } from "react";
import styles from './SimulationForm.module.css';
import { useOutletContext } from "react-router-dom";
import { FormStatus, MovementBoxData } from "../../model/simulationDataModel";
import FormDefaultBox from "../../components/genericCustom/FormDefaultBox";
import classNames from 'classnames';
import { useLocation } from "react-router-dom";

function MovementTab() {

    const { setDatat } = useOutletContext<{ setDatat: any }>(); // <-- access context value
    const location = useLocation();
    const formStatus = location.state?.status;
    const [movementDataValues] = useState<MovementBoxData[]>([]);

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

    return (
        <div className={classNames(styles.movementTab, (formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')}>
            <div>
                <FormMeansTransport onDataSend={handleSelectedListReceive}></FormMeansTransport>
            </div>
            {x.length == 0 &&
                <FormDefaultBox></FormDefaultBox>
            }
            <div>
                {x?.filter(c => c.checked).sort((a, b) => a.order - b.order).map((item, idx) => (
                    <FormBoxMovement
                        key={idx}
                        setBoxValues={handleBoxDataReceive}
                        informationSourceType={InformationSourceTypes.fromDeduction}
                        options={{ name: item.name, type: 'text', id: item.id, placeholder: 'Description' }} />
                ))}
            </div>
        </div>
    );
} export default MovementTab