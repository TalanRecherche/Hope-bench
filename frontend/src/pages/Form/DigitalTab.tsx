import { useState } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import FormDigitalEquipments from '../../components/FormDigitalEquipments';
import FormBoxDigital from '../../components/formBox/FormBoxDigital';
import DigitalTabStartingBox from '../../components/DigitalTabStartingBox';
import BoxSelectedList from '../../components/genericCustom/BoxSelectedList';

import styles from './SimulationForm.module.scss';
import { DigitalBoxData, FormStatus, InformationType } from '../../model/simulationDataModel';

import classNames from 'classnames';


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
        <>
         {/* <div className={styles.digitalTabWrapper}> */}
            <div className={styles.leftColumn}>
                {/* Affichage conditionnel de BoxSelectedList : PC, email, cloud,... à gauche*/}
                {isItemChecked() &&
                    <div className={styles.movementTabSelectedListSection}>
                        <BoxSelectedList
                            title="Equipements numérique(s) utilisé(s)"
                            list={x?.filter(c => c.checked).sort((a, b) => a.order - b.order)} />
                    </div>
                }
            </div>

            
            <div className={classNames(styles.rightColumn, {
                [styles.movementTab2]: isItemChecked(), // Applique un style conditionnel
                [styles.movementTab]: !isItemChecked(),
                [styles.formTabDisabled]: formStatus === FormStatus.submitted
            })}>
                {/* Contenu centré */}
                <div className={styles.centeredContent}>
                    <DigitalTabStartingBox sendDigitalDefaultInformation={handleDefaultValues}></DigitalTabStartingBox>

                    {digitalInformationBase == InformationType.needed && (
                        <>
                            <FormDigitalEquipments onDataSend={handleDataReceive}></FormDigitalEquipments>

                            {x?.filter(c => c.checked).sort((a, b) => a.order - b.order).map((item, idx) => (
                                <FormBoxDigital
                                    key={idx}
                                    setValues={handleBoxDataReceive}
                                    options={{ name: item.name, type: 'text', id: item.id, placeholder: 'Description' }} />
                            ))}

                        </>
                    )}
                </div>
                {/* Conteneur pour les boutons suivant et précédent */}
                <div className={styles.buttonContainer}>
                    <button type="button" className={styles.nextButton} >
                        Précédent
                    </button>
                    <button type="button" className={styles.nextButton} >
                        Suivant
                    </button>
                </div>
            </div>
        {/* </div> */}
        </>  
    );
    
} export default DigitalTab