import { Card, Form } from "react-bootstrap";
import styles from './FormComponents.module.scss';
import { useOutletContext,useLocation } from "react-router-dom";
import { FormDataContext } from "../pages/Form/FormBase";


interface Props {
    sendMovementDefaultInformation?: any
}

const MovementTabStartingBox = ({sendMovementDefaultInformation: sendInformation} : Props) => {

    const location = useLocation();
    const { currentEntry } = location.state || {}; // Récupère currentEntry

    // Vous pouvez utiliser currentEntry ici si nécessaire
    console.log("Current Entry in MovementTab:", currentEntry);

    const { datat, setDatat } = useOutletContext<FormDataContext>(); // <-- access context value
    console.log("Valeurs reçues dans MovementTab:", datat);

    //Récupèration des données du contexte
    const {formStatus, formName } = datat || {};
    const format=datat?.formListData?.format;
    const numberOfPages=datat?.formListData?.numberOfPages;
    const lastUpdate=datat?.formListData?.lastUpdate;

    console.log(formStatus, formName, format, numberOfPages, lastUpdate);



    const radioChangeFormData = (e: any) => {
        const { id } = e.target;        
        sendInformation(id);
    };

    return (
        <Card className={styles.defaultBox} >
            <Card.Body>
                <Form.Group className={styles.labelSemiBold}>
                    <Form.Label className={styles.required}> Cette mission implique-t'elle des déplacements de consultants chez le client? </Form.Label>
                    <div className={`${styles.subtitle}`}>Si l'information n'est pas présente mais qu'il existe des indices, je fais une supposition.</div>
                </Form.Group>
                <Form.Check
                    name="travelInformation"
                    type="radio"
                    label="Oui, je peux quantifier l'ensemble des déplacements de consultants chez le client."
                    id="needed"
                    onChange={(e) => radioChangeFormData(e)}
                    className="mt-3"
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