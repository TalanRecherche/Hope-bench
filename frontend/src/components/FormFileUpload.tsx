
import { Card,Form } from "react-bootstrap";
import styles from './InformationSource.module.css';

function FormFileUpload() {

    return (
        <>
            <Card className={styles.informationField}>
                <Form.Group controlId="formFileLg" className="mb-6" >
                    <Form.Label className={styles.required} > Field title </Form.Label>
                    <Form.Control type="file" size="lg"/>                 
                </Form.Group>
            </Card>
            {/* <Card className={styles.informationField}>
                <Row>
                    <Col md>

                        <Form.Label className={styles.required} > Field title </Form.Label>
                        <Card.Body>
                            <FloatingLabel controlId="uploadFile" label="Upload">
                                <Form.Control
                                    as="textarea"
                                    placeholder="+ Upload"
                                    style={{ height: '100px' }}
                                />
                            </FloatingLabel>
                        </Card.Body>
                    </Col>
                    <Col md>
                        <FloatingLabel
                            controlId="floatingSelectGrid"
                            label="Works with selects"
                        ></FloatingLabel>
                    </Col>
                </Row>
            </Card> */}
        </>
    );
}

export default FormFileUpload;