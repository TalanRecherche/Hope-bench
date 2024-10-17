import Form from 'react-bootstrap/Form';
import styles from './FormComponents.module.css';

interface Props {
    label: string;
    setSourceBaseValue?: any
}

function InformationSourceBase({ label, setSourceBaseValue }: Props) {
    const changeFormData = (e: any) => {
        const { checked } = e.target;
        setSourceBaseValue(checked);
    };

    return (
        <Form.Check
         className={ styles.informationSourceBase }
            inline
            name="informationSourceBase"
            type="checkbox"
            label={label}
            id="informationSourceBase"
            onChange={(e) => changeFormData(e)}
        />
    );
}
export default InformationSourceBase