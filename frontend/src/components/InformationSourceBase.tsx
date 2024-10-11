import Form from 'react-bootstrap/Form';
import styles from './FormComponents.module.css';

interface Props {
    setSourceBaseValue?: any
}

function InformationSourceBase({ setSourceBaseValue }: Props) {

    const label = "L’information n’est pas dans le document, je n’ai pas les connaissances ni accès à des sources d’information externes pour répondre."

    const changeFormData = (e: any) => {
        const { checked } = e.target;
        setSourceBaseValue(checked);
    };

    return (
        <Form.Check
         className={ styles.informationSourceBase }
            inline
            name="informationNotInTheDocument"
            type="checkbox"
            label={label}
            id="deduced-from-document"
            onChange={(e) => changeFormData(e)}
        />
    );
}
export default InformationSourceBase