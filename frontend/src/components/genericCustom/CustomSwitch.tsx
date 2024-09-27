import { useState } from 'react';
import styles from '../FormComponents.module.css';

interface Props {
    floatingContainer: boolean;
    sendSwitchValue: any;
}

const CustomSwitch = ({ floatingContainer = false, sendSwitchValue}: Props) => {

    const styleActive = { "backgroundColor": '#3d00f2', "color": "white" } as React.CSSProperties;
    const styleNoteActive = { "color": "#3d00f2" } as React.CSSProperties;

    let switchOptions = {
        option1: {
            label: 'Mensuel',
            checked: true
        },
        option2: {
            label: 'Global',
            checked: false
        }
    }

    const [checked, setChecked] = useState(true);

    function handleSwitchClick(optionLabel: string) {

        if (switchOptions.option2.label == optionLabel) {
            setChecked(switchOptions.option2.checked);
        }
        else {
            setChecked(switchOptions.option1.checked);
        }
        sendSwitchValue(optionLabel);
    }

    return (
        <div className={floatingContainer ? styles.switchContainerFloat : styles.switchContainer}>
            <div
                className={styles.toggleItem}
                style={checked ? styleActive : styleNoteActive}
                onClick={() => handleSwitchClick(switchOptions.option1.label)}
            >
                <div className={styles.customSwitchText}>{switchOptions.option1.label}</div>
            </div>
            <div
                className={styles.toggleItem}
                style={!checked ? styleActive : styleNoteActive}
                onClick={() => handleSwitchClick(switchOptions.option2.label)}
            >
                <div className={styles.customSwitchText}>Global</div>
            </div>
        </div>
    );
}
export default CustomSwitch;