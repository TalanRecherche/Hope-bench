import FormBoxMovement from "../../components/formBox/FormBoxMovement";
import FormMeansTransport from '../../components/FormMeansTransport';
import { InformationSourceTypes } from "../../components/InformationSource";
import { useState } from "react";
import styles from './SimulationForm.module.css';
import { useOutletContext } from "react-router-dom";
import { movementBoxData } from "../../model/generalDataModel";

function MovementTab() {

    const { setDatat } = useOutletContext<{ setDatat: any }>(); // <-- access context value
    const [movementValues] = useState<movementBoxData[]>([]);

    let displayList: {
        id: string,
        name: string,
        checked: boolean,
        order: number
    }[] = [];

    const [x, setX] = useState(displayList);
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

    const handleSourceDataReceive = (receivedData: any) => {
        
        var index = movementValues.findIndex(m => m.optionName == receivedData.optionName);
        if (index == -1) {
            movementValues.push(receivedData);
        }
        else {
            movementValues.splice(index, 1);
            movementValues.push(receivedData);
        }
        setDatat(movementValues);
    };

    return (
        <div className={styles.movementTab}>
            <div>
                <FormMeansTransport onDataSend={handleDataReceive}></FormMeansTransport>
            </div>
            <div>

                {x?.filter(c => c.checked).sort((a, b) => a.order - b.order).map((item, idx) => (
                    <FormBoxMovement
                        key={idx}
                        setBoxValues={handleSourceDataReceive}
                        informationSourceType={InformationSourceTypes.fromDeduction}
                        options={{ name: item.name, type: 'text', id: item.id, placeholder: 'Description' }} />
                ))}
            </div>
        </div>
    );
} export default MovementTab