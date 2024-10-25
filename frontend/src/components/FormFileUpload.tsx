
import { Card,Form } from "react-bootstrap";
import styles from './FormComponents.module.scss';

function FormFileUpload() {

    return (
        <>
            <Card className={styles.boxGeneral}>
                <Form.Group controlId="formFileLg"  >
                    <Form.Label className={styles.required} > Field title </Form.Label>
                    <Form.Control type="file" size="lg"/>                 
                </Form.Group>
            </Card>            
        </>
    );
}
export default FormFileUpload;