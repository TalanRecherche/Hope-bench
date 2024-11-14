import { useState } from 'react';
import styles from '../FormComponents.module.scss';
import { CustomSwitchOptions } from '../../model/simulationDataModel';

interface Props {    
    floatingContainer: boolean;
    options: CustomSwitchOptions; //tableau d'options
    sendSwitchValue: (value: string) => void; // Fonction qui envoie la valeur de l'option sélectionnée
}

const CustomSwitch = ({ floatingContainer = false, options, sendSwitchValue}: Props) => {

    const styleActive = { "backgroundColor": '#3d00f2', "color": "white" } as React.CSSProperties;
    const styleNoteActive = { "color": "#A5A5A5","border": "0.25px solid #D3D3D3" } as React.CSSProperties;
    const [checked, setChecked] = useState(0);// Utilisation de l'index pour savoir quelle option est sélectionnée

    // Fonction pour gérer le clic sur les options
    function handleSwitchClick(optionIndex: number) {
        setChecked(optionIndex); // Met à jour l'index de l'option sélectionnée
        sendSwitchValue(options[optionIndex].label); // Envoie le label de l'option sélectionnée
    }

    //  // Créer une liste des options (pour itérer dynamiquement)
    //  const optionKeys = Object.keys(options);

    return (
        <div className={floatingContainer ? styles.switchContainerFloat : styles.switchContainer}>
            {/* <div
                className={styles.toggleItem}
                style={checked ? styleActive : styleNoteActive}
                onClick={() => handleSwitchClick(options.option1.label)}
            >
                <div className={styles.customSwitchText}>{options.option1.label}</div>
            </div>
            <div
                className={styles.toggleItem}
                style={!checked ? styleActive : styleNoteActive}
                onClick={() => handleSwitchClick(options.option2.label)}
            >
                <div className={styles.customSwitchText}>{options.option2.label}</div>
            </div> */}
             {options.map((option, index) => (
                <div
                    key={index}
                    className={styles.toggleItem}
                    style={checked === index ? styleActive : styleNoteActive} // Applique le style en fonction de l'index sélectionné
                    onClick={() => handleSwitchClick(index)} // Passe l'index de l'option
                >
                    <div className={styles.customSwitchText}>{option.label}</div>
                </div>
            ))}
        </div>
    );
}
export default CustomSwitch;