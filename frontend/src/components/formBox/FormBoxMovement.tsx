import Form from 'react-bootstrap/Form';
import InformationSource from "../InformationSource";
import Card from 'react-bootstrap/Card';
import styles from '../InformationSource.module.css';
import NumericInput from 'react-numeric-input';
import CustomSwitch from '../CustomSwitch';

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

function FormBoxMovement<T extends string>({ isDefaultInformationSource = true, options }: Props<T>) {

    return (
        <>
            <Card>
            <Card.Body >
                    <Form.Group controlId={options.controlId}>
                        <Form.Label className={styles.movementFieldLabel}>{options.name}</Form.Label>
                        <CustomSwitch></CustomSwitch>
                    </Form.Group>

                    <span className={styles.required}> Nombre de fois où le collaborateur se déplace en {options.name} </span>
                    <span style={{ float:'right'}}><NumericInput  min={0} max={2} value={3} size={1}/>
                    </span>
                    <br />
                    
                    <Form.Group controlId={options.controlId}>
                        <Form.Label className={styles.required}>Moyenne de km par déplacement en {options.name}</Form.Label>
                        <Form.Control                            
                            type={options.type}
                            id={options.id}
                            placeholder={options.placeholder}
                        />
                    </Form.Group>
                    </Card.Body>       
            </Card>
            <Card className={styles.marginBottom20}>
                <Card.Body>
                    <InformationSource isDefaultInformationSource={isDefaultInformationSource} />
                </Card.Body>
            </Card>
        </>
    );
}

export default FormBoxMovement