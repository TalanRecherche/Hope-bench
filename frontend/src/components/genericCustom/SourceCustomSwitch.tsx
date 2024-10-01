import { useState } from 'react';
import styles from '../FormComponents.module.css';

interface Props {
    initialValue?: boolean;
    sendSwitchValue: any;
};

const SourceCustomSwitch = ({ initialValue = false, sendSwitchValue }: Props) => {

    const styleNo = { "backgroundColor":  '#3d00f2', "color": "white" } as React.CSSProperties;
    const styleYes = { "color": "#3d00f2" } as React.CSSProperties;

    const [checked, setChecked] = useState(initialValue);
    function handleSwitchClick(value: boolean) {
        sendSwitchValue(value);
        setChecked(value);
    }

    return (
        <div className={ styles.sourceSwitchContainerFloat }>
            <div
                className={styles.sourceToggleItem}
                style={!checked ? styleNo : styleYes}
                onClick={() => handleSwitchClick(false)}
            >
                <div className={styles.customSwitchText}>Non</div>
            </div>
            <div
                className={styles.sourceToggleItem}
                style={!checked ? styleYes : styleNo}
                onClick={() => handleSwitchClick(true)}
            >
                <div className={styles.customSwitchText}>Oui</div>
            </div>
        </div>
    )
}
export default SourceCustomSwitch;