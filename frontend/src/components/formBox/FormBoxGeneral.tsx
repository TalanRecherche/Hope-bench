import Form from 'react-bootstrap/Form';
import InformationSource from "../InformationSource";
import Card from 'react-bootstrap/Card';
import styles from '../FormComponents.module.css';
import NumericInput from 'react-numeric-input';
import { InformationSourceData } from '../../model/simulationDataModel';
import InformationSourceBase from '../InformationSourceBase';
import { useState } from 'react';

interface Props<T> {
    isNumericInput?: boolean,
    options: {
        controlId?: T;
        name: T;
        type: T;
        id: T;
        placeholder: T;
        value?: T;
        informationSourceData?: InformationSourceData;
    },
    setValues?: any
}

function FormBoxGeneral<T extends string>({ isNumericInput = false, options, setValues }: Props<T>) {

    const [informationSourceBase, setInformationSourceBase] = useState(false);

    const setOptionValue = (value: any) => {
        options.value = value;
        setValues(options);
    };

    const setSourceData = (sourceData: any) => {
        options.informationSourceData = sourceData;
        setValues(options);
    }

    let card;
    if (isNumericInput) {
        card =
            <Card.Body>
                <a>{options.name} </a> <NumericInput size={1} onChange={(value) => setOptionValue(value)} />
            </Card.Body>;
    }
    else {
        card =
            <Card.Body >
                <Form.Group controlId={options.controlId}>
                    <Form.Label className={styles.required}>{options.name}</Form.Label>
                    <Form.Control
                        type={options.type}
                        id={options.id}
                        placeholder={options.placeholder}
                        onChange={(e) => setOptionValue(e.target.value)}
                    />
                    <InformationSourceBase setSourceBaseValue={setInformationSourceBase}></InformationSourceBase>
                </Form.Group>
            </Card.Body>;
    }

    return (
        <div className={styles.boxGeneral}>
            <Card style={{ borderRadius: " 4px 4px 0px 0px" }} className={styles.boxItem}>
                {card}
            </Card>
            { (!informationSourceBase && options.value) && <Card style={{ borderRadius: " 0px 0px 4px 4px" }} className={styles.informationSource}>
                <Card.Body>
                    <InformationSource
                        setSourceValues={setSourceData} />
                </Card.Body>
            </Card>
            }
        </div>
    );
}
export default FormBoxGeneral