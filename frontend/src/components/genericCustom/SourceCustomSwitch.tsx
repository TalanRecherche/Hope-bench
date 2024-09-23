import { useState } from 'react';
import styles from '../InformationSource.module.css';

interface Props {
    floatingContainer: boolean;
    initialValue?: boolean;
    sendSwitchValue: any
};

const SourceCustomSwitch = ({ floatingContainer = false, initialValue = false, sendSwitchValue }: Props) => {


    const styleNo = { "backgroundColor": "blue", "color": "white" } as React.CSSProperties;
    const styleYes = { "color": "blue" } as React.CSSProperties;

    const [checked, setChecked] = useState(initialValue);
    function handleSwitchClick(value: boolean) {
        sendSwitchValue(value);
        setChecked(value);
    }

    return (
        <div className={floatingContainer ? styles.switchContainerFloat : styles.switchContainer}>
            <div
                className={styles.sourceToggleItem}
                style={!checked ? styleNo : styleYes}
                onClick={() => handleSwitchClick(false)}
            >
                <div className={styles.text}>Non</div>
            </div>
            <div
                className={styles.sourceToggleItem}
                style={!checked ? styleYes : styleNo}
                onClick={() => handleSwitchClick(true)}
            >
                <div className={styles.text}>Oui</div>
            </div>
        </div>
    )
}
export default SourceCustomSwitch;