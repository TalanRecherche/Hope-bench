import styles from '../FormComponents.module.css';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import NumericInput from 'react-numeric-input';
import CustomSwitch from '../genericCustom/CustomSwitch';
import Button from 'react-bootstrap/Button';
import InformationSource, { InformationSourceTypes } from '../InformationSource';
import { InformationSourceData } from '../../model/generalDataModel';

interface Props<T> {
    informationSourceType?: InformationSourceTypes,
    options: {
        informationSourceData?: InformationSourceData;
    },    
    setValues?:any
}

function FormBoxOffice<T extends string>({ informationSourceType = InformationSourceTypes.default, options, setValues }: Props<T>) {

    const setSourceData = (sourceData : any) => {
        options.informationSourceData = sourceData;
        setValues(options);
    }

    return (
        <>
            <div className={styles.baseContainer}>
                <Card className={styles.marginTopLeftRight20}>
                    <Card.Body >
                        <Form>
                            <div>
                                <span className={styles.required}> Copies papier utilisées </span>
                            </div>
                            <br />
                            <div>
                                <span className={styles.marginRight10}>
                                    <NumericInput
                                        style={{ input: { height: 28 } }}
                                        className={styles.numericInput}
                                        min={0} max={5} value={3} size={1} />
                                </span>
                                <CustomSwitch floatingContainer={false}></CustomSwitch>
                            </div>
                            <br />
                            <div>
                                <Button variant="outline-primary" size="sm" >Ajouter +</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card >
                <Card className={styles.marginLeftRight20}>
                    <Card.Body>
                        <InformationSource informationSourceType={informationSourceType} 
                    setSourceValues={setSourceData}/>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}
export default FormBoxOffice;