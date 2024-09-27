import Form from 'react-bootstrap/Form';
import InformationSource, { InformationSourceTypes } from "../InformationSource";
import Card from 'react-bootstrap/Card';
import styles from '../FormComponents.module.css';
import NumericInput from 'react-numeric-input';
import CustomSwitch from '../genericCustom/CustomSwitch';
import { InformationSourceData, movementBoxData } from '../../model/generalDataModel';
import { useState } from 'react';

interface Props<T> {
    informationSourceType?: InformationSourceTypes,
    isNumericInput?: boolean,
    options: {
        name: T;
        type: T;
        id: T;
        placeholder: T;
        informationSourceData?: InformationSourceData;
    },
    movementData?: movementBoxData;
    setBoxValues?: any
}

function FormBoxMovement<T extends string>({ informationSourceType = InformationSourceTypes.default, options, movementData, setBoxValues: setValues }: Props<T>) {

    const [movementBoxValues, setMovementBoxValues] = useState<movementBoxData>({
        optionName: options.name
    });
 
    function handleChange(value: any, name: string) {
        setMovementBoxValues({
            ...movementBoxValues,
            [name]: value
        });

        movementData = movementBoxValues;
        setValues(movementData);
    }

    const setSourceData = (sourceData: any) => {
        movementBoxValues.informationSource = sourceData;
        movementData = movementBoxValues;
        setValues(movementData);
    }

    return (
        <div className={styles.boxMovement}>
            <Card className={styles.boxItem}>
                <Card.Body>
                    <Form.Group>
                        <Form.Label className={styles.movementFieldLabel}>{options.name}</Form.Label>
                        <CustomSwitch sendSwitchValue={(e: any) => handleChange(e, "movementFrequency",)} floatingContainer={true}></CustomSwitch>
                    </Form.Group>

                    <span className={styles.required}> Nombre de fois où le collaborateur se déplace en {options.name} </span>
                    <span style={{ float: 'right' }}><NumericInput size={1} onChange={(e) => handleChange(e, "numberOfMovement")} />
                    </span>
                    <br />

                    <Form.Group>
                        <Form.Label className={styles.required}>Moyenne de km par déplacement en {options.name}</Form.Label>
                        <Form.Control
                            type={options.type}
                            id={options.id}
                            placeholder={options.placeholder}
                            onChange={(e) => handleChange(e.target.value, "averageKmPerTrip")}
                        />
                    </Form.Group>
                </Card.Body>
            </Card>
            <Card className={styles.informationSource}>
                <Card.Body>
                    <InformationSource
                        informationSourceType={informationSourceType}
                        setSourceValues={setSourceData} />
                </Card.Body>
            </Card>
        </div>
    );
} export default FormBoxMovement;