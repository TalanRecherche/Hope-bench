import styles from '../InformationSource.module.css';

interface Props {
    floatingContainer: boolean;
}

const CustomSwitch = ({floatingContainer = false} : Props) => (
    <div className={floatingContainer? styles.switchContainerFloat : styles.switchContainer }>
        <div
            className={styles.toggleItem}
            style={{
                backgroundColor: "blue",
                color: "white"
            }}
        // onClick={() => handleSwitchClick(SwitchOptions.OPTION1)}
        >
            <div className={styles.text}>Mensuel</div>
        </div>
        <div
            className={styles.toggleItem}
            style={{
                color: "blue"
            }}
        //onClick={() => handleSwitchClick(SwitchOptions.OPTION2)}
        >
            <div className={styles.text}>Global</div>
        </div>
    </div>
);
export default CustomSwitch;