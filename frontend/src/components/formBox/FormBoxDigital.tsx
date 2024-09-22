import Form from 'react-bootstrap/Form';
import InformationSource, { InformationSourceTypes } from "../InformationSource";
import Card from 'react-bootstrap/Card';
import styles from '../InformationSource.module.css';
import NumericInput from 'react-numeric-input';
import CustomTable from '../genericCustom/CustomTable';
import Button from 'react-bootstrap/Button';
import { InformationSourceData } from '../../model/generalDataModel';

interface Props<T> {
    informationSourceType?: InformationSourceTypes,
    options: {
        name: T;
        type: T;
        id: T;
        placeholder: T;
        informationSourceData?: InformationSourceData;
    },    
    setValues?:any
}

function FormBoxDigital<T extends string>({ informationSourceType = InformationSourceTypes.default, options, setValues }: Props<T>) {
    
    const setSourceData = (sourceData : any) => {
        options.informationSourceData = sourceData;
        setValues(options);
    }

    return (
        <>
            <Card>
                <Card.Body >
                    <Form>
                        <Form.Group>
                            <Form.Label className={styles.movementFieldLabel}>{options.name}</Form.Label>
                            <div className={styles.required}> Sélectionnez chaque produit ainsi que le nombre de personnes auxquelles il a été distribué. </div>
                            <p className={styles.SubText}> Par exemple, si trois collaborateurs reçoivent un Dell Latitude 5430, sélectionnez le modèle "Dell Latitude 5430" puis rentrez "3" en nombre d'exemplaire, enfin cliquez sur "Ajouter 3 exemplaires".
                                Si des appareils à renseigner sont des ordinateurs Talan ou bien des ordinateurs reconditionnés, sélectionnez l'option appropriée, sinon sélectionnez le modèle approprié ou un modèle équivalent.</p>

                            <Form.Control
                                style={{ width: '90%', display: 'inline-block' }}
                                type={options.type}
                                id={options.id}
                                placeholder={options.placeholder}
                            />
                            <span style={{ float: 'right' }}>
                                <NumericInput
                                    style={{ input: { height: 37 } }}
                                    className={styles.numericInput}
                                    min={0} max={5} value={3} size={1} />
                            </span>

                            <br />
                            <br />
                            <div>
                                <Button variant="outline-primary" size="sm" >Ajouter +</Button>
                            </div>
                            <div>
                                <CustomTable></CustomTable>
                            </div>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
            <Card className={styles.marginBottom20}>
                <Card.Body>
                    <div> {informationSourceType} </div> 
                    <InformationSource informationSourceType={informationSourceType} 
                    setSourceValues={setSourceData}/>
                </Card.Body>
            </Card>
        </>
    )
} export default FormBoxDigital;