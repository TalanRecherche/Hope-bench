import Form from 'react-bootstrap/Form';
import InformationSource from "./InformationSource";
import Card from 'react-bootstrap/Card';
import styles from './InformationSource.module.css';
import NumericInput from 'react-numeric-input';

interface Props<T> {
    isDefaultInformationSource?: boolean,
    isNumericInput?: boolean,
    options: {
        controlId: T;
        name: T;
        type: T;
        id: T;
        placeholder: T;
    }
}

function FormBoxGeneral<T extends string>({ isDefaultInformationSource = true, isNumericInput = false, options }: Props<T>) {

    let card;
    if (isNumericInput) {
        card = <Card.Body>
            <a>{options.name} </a> <NumericInput max={1} value={3} size={1} />
        </Card.Body>;

    }
    else {
        card =
            <Card.Body>
                <Form.Group controlId={options.controlId}>
                    <Form.Label className={styles.required}>{options.name}</Form.Label>
                    <Form.Control
                        type={options.type}
                        id={options.id}
                        placeholder={options.placeholder}
                    />
                </Form.Group>
            </Card.Body>;
    }
    return (
        <>
            <Card className={styles.informationField}>
                {card}
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