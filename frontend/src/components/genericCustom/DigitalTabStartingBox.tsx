import { Card } from "react-bootstrap";
import styles from '../FormComponents.module.css';
import Form from 'react-bootstrap/Form';

interface Props {
    sendDigitalDefaultInformation?: any
}

const DigitalTabStartingBox = ({sendDigitalDefaultInformation: sendInformation} : Props) => {

    const radioChangeFormData = (e: any) => {
        const { id } = e.target;        
        sendInformation(id);
    };

    return (
        <Card className={styles.defaultBox} >
            <Card.Body>
                <Form.Group className={styles.labelSemiBold}>
                    <Form.Label> Cette mission implique des sources de polution </Form.Label>
                </Form.Group>
                <Form.Check
                    name="equipmentInformation"
                    type="radio"
                    label="Oui, j’indique toutes les sources que je suis capable d’identifier ou de supposer en cochant les cases pour les ajouter."
                    id="needed"
                    onChange={(e) => radioChangeFormData(e)}
                />
                <Form.Check
                    name="equipmentInformation"
                    type="radio"
                    label="Non, aucune source n’est à déclarer "
                    id="noNeeded"
                    onChange={(e) => radioChangeFormData(e)}
                />
                <Form.Check
                    name="equipmentInformation"
                    type="radio"
                    label="Je n’ai pas la possibilité d’identifier ou de supposer car aucune information n’est présente dans le document et par manque de connaissance ou d’accès à des sources d’information externes."
                    id="unableToIdentify"
                    onChange={(e) => radioChangeFormData(e)}
                />
            </Card.Body>
        </Card>
    )
}
export default DigitalTabStartingBox;