import FormDigitalEquipments from '../../components/FormDigitalEquipments';
import FormBoxDigital from '../../components/formBox/FormBoxDigital';
import { InformationSourceTypes } from '../../components/InformationSource';
import { useState } from 'react';
import styles from './SimulationForm.module.css';
import { DigitalBoxData } from '../../model/generalDataModel';
import { useOutletContext } from 'react-router-dom';
import FormDefaultBox from '../../components/genericCustom/FormDefaultBox';

function DigitalTab() {

    const { setDatat } = useOutletContext<{ setDatat: any }>();
    const [digitalValues] = useState<DigitalBoxData[]>([]);

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

    return (
        <div className={styles.movementTab}>
            <div>
                <FormDigitalEquipments onDataSend={handleDataReceive}></FormDigitalEquipments>
            </div>
            {x.length == 0 &&
                <FormDefaultBox></FormDefaultBox>
            }
            <div>
                {x?.filter(c => c.checked).sort((a, b) => a.order - b.order).map((item, idx) => (
                    <FormBoxDigital
                        key={idx}
                        setValues={handleBoxDataReceive}
                        informationSourceType={InformationSourceTypes.fromDeduction}
                        options={{ name: item.name, type: 'text', id: item.id, placeholder: 'Description' }} />
                ))}
            </div>
        </div>
    );
} export default DigitalTab