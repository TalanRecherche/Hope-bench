import { useState } from 'react';
import styles from '../FormComponents.module.css';
import { CustomSwitchOptions } from '../../model/generalDataModel';

interface Props {    
    floatingContainer: boolean;
    options: CustomSwitchOptions;
    sendSwitchValue: any;
}

const CustomSwitch = ({ floatingContainer = false, options, sendSwitchValue}: Props) => {

    const styleActive = { "backgroundColor": '#3d00f2', "color": "white" } as React.CSSProperties;
    const styleNoteActive = { "color": "#3d00f2" } as React.CSSProperties;
    const [checked, setChecked] = useState(true);

    function handleSwitchClick(optionLabel: string) {

        if (options.option2.label == optionLabel) {
            setChecked(options.option2.checked);
        }
        else {
            setChecked(options.option1.checked);
        }
        sendSwitchValue(optionLabel);
    }

    return (
        <div className={floatingContainer ? styles.switchContainerFloat : styles.switchContainer}>
            <div
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
            </div>
        </div>
    );
}
export default CustomSwitch;