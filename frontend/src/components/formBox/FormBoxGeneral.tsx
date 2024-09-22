import Form from 'react-bootstrap/Form';
import InformationSource, { InformationSourceTypes } from "../InformationSource";
import Card from 'react-bootstrap/Card';
import styles from '../InformationSource.module.css';
import NumericInput from 'react-numeric-input';
import { InformationSourceData } from '../../model/generalDataModel';

interface Props<T> {
    informationSourceType?: InformationSourceTypes,
    isNumericInput?: boolean,
    options: {
        controlId?: T;
        name: T;
        type: T;
        id: T;
        placeholder: T;
        value?: T;
        informationSourceData?: InformationSourceData
    },    
    setValues?:any
}

function FormBoxGeneral<T extends string>({ informationSourceType = InformationSourceTypes.default, isNumericInput = false, options, setValues }: Props<T>) {
    
    const setOptionValue = (value: any) => {
        options.value = value;
        
        setValues(options);
    };

    const setSourceData = (sourceData : any) => {
        options.informationSourceData = sourceData;
        setValues(options);
    }

    let card;
    if (isNumericInput) {
        card = <Card.Body>
            <a>{options.name} </a> <NumericInput size={1}  onChange={(value) => setOptionValue(value)} />
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
                </Form.Group>
            </Card.Body>;
    }

    return (
        <>
            <Card className={styles.marginTopLeftRight20}>
                {card}
            </Card>
            <Card className={styles.marginLeftRight20}>
                <Card.Body>
                    <InformationSource 
                    informationSourceType = {informationSourceType}
                    setSourceValues={setSourceData}/>
                </Card.Body>
            </Card>
        </>
    );
}

export default FormBoxGeneral