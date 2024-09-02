import Form from 'react-bootstrap/Form';
import InformationSource from "./InformationSource";
import Card from 'react-bootstrap/Card';
import styles from './InformationSource.module.css';

interface Props<T> {
    isDefaultInformationSource: boolean,
    options: {
        controlId: T;
        name: T;
        type: T;
        id: T;
        placeholder: T;
    }
}

function FormBoxGeneral<T extends string>({ isDefaultInformationSource, options }: Props<T>) {

    return (
        <>
            <Card className={styles.informationField}>
                <Card.Body>
                    <Form.Group controlId={options.controlId}>
                        <Form.Label className={styles.required}>{options.name}</Form.Label>
                        <Form.Control
                            type={options.type}
                            id={options.id}
                            placeholder={options.placeholder}
                        />
                    </Form.Group>
                </Card.Body>
            </Card>
            <Card className={styles.informationLabel}>
                <Card.Body>
                    <InformationSource isDefaultInformationSource={isDefaultInformationSource} />
                </Card.Body>
            </Card>
        </>
    );
}

export default FormBoxGeneral