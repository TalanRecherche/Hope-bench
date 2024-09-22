import Form from 'react-bootstrap/Form';
import InformationSource, { InformationSourceTypes } from "../InformationSource";
import Card from 'react-bootstrap/Card';
import styles from '../InformationSource.module.css';
import NumericInput from 'react-numeric-input';
import CustomSwitch from '../genericCustom/CustomSwitch';
import { InformationSourceData } from '../../model/generalDataModel';

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
    setValues?:any
}

function FormBoxMovement<T extends string>({ informationSourceType = InformationSourceTypes.default, options, setValues }: Props<T>) {

    const setSourceData = (sourceData : any) => {
        options.informationSourceData = sourceData;
        setValues(options);
    }
    
    return (
        <>
            <Card>
                <Card.Body >
                    <Form.Group>
                        <Form.Label className={styles.movementFieldLabel}>{options.name}</Form.Label>
                        <CustomSwitch floatingContainer={true}></CustomSwitch>
                    </Form.Group>

                    <span className={styles.required}> Nombre de fois où le collaborateur se déplace en {options.name} </span>
                    <span style={{ float: 'right' }}><NumericInput min={0} max={2} value={3} size={1} />
                    </span>
                    <br />

                    <Form.Group>
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
                    <InformationSource informationSourceType={informationSourceType} 
                    setSourceValues={setSourceData}/>
                </Card.Body>
            </Card>
        </>
    );
} export default FormBoxMovement ;