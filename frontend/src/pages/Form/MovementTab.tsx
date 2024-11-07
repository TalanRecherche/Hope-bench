import FormBoxMovement from "../../components/formBox/FormBoxMovement";
import FormMeansTransport from '../../components/FormMeansTransport';
import { useState } from "react";
import styles from './SimulationForm.module.scss';
import { useOutletContext } from "react-router-dom";
import { FormStatus, MovementBoxData, InformationType } from "../../model/simulationDataModel";
import MovementTabStartingBox from "../../components/MovementTabStartingBox";
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
    // console.log(displayList);

    const handleSelectedListReceive = (data: any) => {

        setX(x => {
            if (data[0].checked) { //si le 1er élément de data est coché
                x = x.concat(data); //on ajoute ceté élement à la liste
            }
            else {//si pas coché, on le retire de x
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
        // est ce que movementDataValues contient déjà optionName
        var index = movementDataValues.findIndex(m => m.optionName == receivedData.optionName);
        if (index == -1) {
            movementDataValues.push(receivedData); //l'élément n'existe pas donc on l'ajoute à movementDataValues
        }
        else { //si l'élément existe déjà, on le supprime et on le remet à la fin de la liste
            movementDataValues.splice(index, 1);
            movementDataValues.push(receivedData);
        }
        setDatat(movementDataValues); //mise à jour du contexte avec les données de mouvement mises à jour
    };

    const handleDefaultValues = (receivedValue: any) => {
        if (receivedValue != InformationType.needed) //si aucune information supplémentaire n'est requise
            setX(displayList); //on réinitialise x à displayList
        setMovementInformationBase(receivedValue); //on remet à 0 la liste des moyens de transport
    };

    const isItemChecked = () => { //si au moins un élément de x est coché
        return x?.filter(c => c.checked).length != 0;
    }

    return (
        <div className="pageContainer">
            {/* Contenu principal */}
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
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
        </div>
    );
} export default MovementTab;