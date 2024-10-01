import { Card } from "react-bootstrap";
import styles from '../FormComponents.module.css';
import logo from "../../assets/avion.svg";

const FormDefaultBox = () => {
    return (
        <Card className={styles.defaultBox} >
            <Card.Body>
                <Card.Text className={styles.defaultBoxText}>Cocher les cases pour ajouter des informations</Card.Text>
                <Card.Img src={logo}/>
            </Card.Body>
        </Card>
    )
}
export default FormDefaultBox;