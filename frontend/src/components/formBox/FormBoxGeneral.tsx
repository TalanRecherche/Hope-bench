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

    const informationSourceBaseLabel = "L’information n’est pas dans le document, je n’ai pas les connaissances ni accès à des sources d’information externes pour répondre."
    const [informationSourceBase, setInformationSourceBase] = useState(false);
    const [displayInformationSource, setDisplayInformationSource] = useState<any>(false);

    const setOptionValue = (value: any) => {

        if (typeof value === 'number') {
            setDisplayInformationSource(value > 0);
        }
        else if (Date.parse(value)) {
            setDisplayInformationSource(value != "");
        }
        else if (value == "")
            setDisplayInformationSource(false);

        options.value = value;
        setValues(options);
    };

    const handleKeyPress = (e: any) => {
        if (e.code === "Enter" || e.code === "Space") {
            {
                setDisplayInformationSource(true);
            }
        }
    };

    const setSourceData = (sourceData: any) => {
        options.informationSourceData = sourceData;
        setValues(options);
    }

    let card;
    if (isNumericInput) {
        card =
            <Card.Body>
                <a>{options.name} </a>
                <div>
                    <NumericInput min={0} size={1} onChange={(value) => setOptionValue(value)} />
                </div>
                <InformationSourceBase label={informationSourceBaseLabel} setSourceBaseValue={setInformationSourceBase}></InformationSourceBase>
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
                        onKeyPress={handleKeyPress}
                    />
                    <InformationSourceBase label={informationSourceBaseLabel} setSourceBaseValue={setInformationSourceBase}></InformationSourceBase>
                </Form.Group>
            </Card.Body>;
    }

    return (
        <div className={styles.boxGeneral}>
            <Card style={{ borderRadius: " 4px 4px 0px 0px" }} className={styles.boxItem}>
                {card}
            </Card>
            {((!informationSourceBase) && displayInformationSource) &&
                <Card style={{ borderRadius: " 0px 0px 4px 4px" }} className={styles.informationSource}>
                    <Card.Body>
                        <InformationSource
                            setSourceValues={setSourceData} />
                    </Card.Body>
                </Card>
            }
        </div>
    );
}
export default FormBoxGeneral;