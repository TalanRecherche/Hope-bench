import { Card } from "react-bootstrap";
import styles from './FormComponents.module.scss';
import Form from 'react-bootstrap/Form';

interface Props {
    sendMovementDefaultInformation?: any
}

const MovementTabStartingBox = ({sendMovementDefaultInformation: sendInformation} : Props) => {

    const radioChangeFormData = (e: any) => {
        const { id } = e.target;        
        sendInformation(id);
    };

    return (
        <Card className={styles.defaultBox} >
            <Card.Body>
                <Form.Group className={styles.labelSemiBold}>
                    <Form.Label> Cette mission implique des déplacements exceptionnels ou réguliers de consultants chez le client </Form.Label>
                </Form.Group>
                <Form.Check
                    name="travelInformation"
                    type="radio"
                    label="Oui, j’indique tous les moyens de transport que je suis capable d’identifier ou de supposer en cochant les cases pour les ajouter."
                    id="needed"
                    onChange={(e) => radioChangeFormData(e)}
                />
                <Form.Check
                    name="travelInformation"
                    type="radio"
                    label="Non, aucun déplacement n’est à déclarer "
                    id="noNeeded"
                    onChange={(e) => radioChangeFormData(e)}
                />
                <Form.Check
                    name="travelInformation"
                    type="radio"
                    label="Je n’ai pas la possibilité d’identifier ou de supposer car aucune information n’est présente dans le document et par manque de connaissance ou d’accès à des sources d’information externes."
                    id="unableToIdentify"
                    onChange={(e) => radioChangeFormData(e)}
                />
            </Card.Body>
        </Card>
    )
}
export default MovementTabStartingBox;