import Form from 'react-bootstrap/Form';
import InformationSource from "../InformationSource";
import Card from 'react-bootstrap/Card';
import styles from '../FormComponents.module.css';
import NumericInput from 'react-numeric-input';
import CustomSwitch from '../genericCustom/CustomSwitch';
import { CustomSwitchOptions, InformationSourceData, MovementBoxData } from '../../model/simulationDataModel';
import { useState } from 'react';
import classNames from 'classnames';
import InformationSourceBase from '../InformationSourceBase';

interface Props<T> {
    isNumericInput?: boolean,
    options: {
        name: T;
        type: T;
        id: T;
        placeholder: T;
        informationSourceData?: InformationSourceData;
    },
    movementData?: MovementBoxData;
    setBoxValues?: any
}

function FormBoxMovement<T extends string>({ options, movementData, setBoxValues: setValues }: Props<T>) {

    const [movementBoxValues, setMovementBoxValues] = useState<MovementBoxData>({
        optionName: options.name
    });

    const switchOptions: CustomSwitchOptions = {
        option1: {
            label: 'Par mois',
            checked: true
        },
        option2: {
            label: 'Au Global',
            checked: false
        }
    };

    const [displayInformationSource, setDisplayInformationSource] = useState<any>(false);
    const [kmInformationSourceBase, setKmInformationSourceBase] = useState(false);
    const kmInformationSourceBaseLabel = "Je suis incapable d’estimer le nombre de km même avec une marge d’erreur."

    //Average
    const [kmAverageInformationSourceBase, setKmAverageInformationSourceBase] = useState(false);
    const kmAverageInformationSourceBaseLabel = "Je suis incapable d’estimer la moyenne de km même avec une marge d’erreur.";
    const [displayAverageInformationSource, setDisplayAverageInformationSource] = useState<any>(false);

    const movementFrequencyDefault = switchOptions.option1.label;

    function handleChange(value: any, name: string) {

        if (typeof value === 'number') {
            setDisplayInformationSource(value > 0);
        }
        else 
            setDisplayAverageInformationSource(value != "");
        
        if (!movementBoxValues.movementFrequency) {
            setMovementBoxValues({
                ...movementBoxValues,
                [name]: movementFrequencyDefault
            });
        }

        movementData = movementBoxValues;
        setValues(movementData);
    }

    const setSourceData = (sourceData: any) => {
        movementBoxValues.informationSource = sourceData;
        movementData = movementBoxValues;
        setValues(movementData);
    }

    const handleKeyPress = (e: any) => {
        if (e.code === "Enter" || e.code === "Space") {
            {
                setDisplayAverageInformationSource(true);
            }
        }
    };

    return (
        <div className={styles.boxMovement}>
            <Card style={{ borderRadius: " 4px 4px 4px 4px" }} className={styles.boxItem}>
                <Form.Label className={styles.movementFieldLabel}>{options.name}</Form.Label>
                <Card style={{ margin: "10px 10px 10px 10px" }}>
                    <Card.Body>
                        <div>
                            <div className={classNames(styles.TextBold, styles.required)}>Indication ou estimation du nombre de fois ou 1 collaborateur se déplace</div>
                            <div className={styles.boxSubTitle}>Si cela concerne plusieurs collaborateurs, veuillez les additionner</div>
                        </div>
                        <br />
                        <NumericInput style={{ input: { textAlign: 'center' } }} min={0} size={1} onChange={(e) => handleChange(e, "numberOfMovement")} />
                        <CustomSwitch options={switchOptions} sendSwitchValue={(e: any) => handleChange(e, "movementFrequency",)} floatingContainer={false}></CustomSwitch>

                        <InformationSourceBase label={kmInformationSourceBaseLabel} setSourceBaseValue={setKmInformationSourceBase}></InformationSourceBase>

                    </Card.Body>
                    {(!kmInformationSourceBase && displayInformationSource) &&
                        <Card style={{ borderRadius: " 0px 0px 4px 4px" }} className={styles.informationSourceBis}>
                            <Card.Body>
                                <InformationSource
                                    setSourceValues={setSourceData} />
                            </Card.Body>
                        </Card>
                    }
                </Card>

                <Card style={{ margin: "10px 10px 10px 10px" }}>
                    <Card.Body>
                        <div className={classNames(styles.TextBold, styles.required)}>Moyenne de km par déplacement en {options.name}</div>
                        <div className={styles.boxSubTitle}>Si le résultat n’est pas précis, estimer avec une marge d’erreur de 200km  </div>
                        <br />
                        <Form.Control
                            type={options.type}
                            id={options.id}
                            placeholder={options.placeholder}
                            onKeyPress={handleKeyPress}
                            onChange={(e) => handleChange(e.target.value, "averageKmPerTrip")}
                        />

                        <InformationSourceBase label={kmAverageInformationSourceBaseLabel} setSourceBaseValue={setKmAverageInformationSourceBase}></InformationSourceBase>

                    </Card.Body>
                    {(!kmAverageInformationSourceBase) && displayAverageInformationSource &&
                        <Card style={{ borderRadius: " 0px 0px 4px 4px" }} className={styles.informationSourceBis}>
                            <Card.Body>
                                <InformationSource
                                    setSourceValues={setSourceData} />
                            </Card.Body>
                        </Card>
                    }
                </Card>
            </Card>
        </div >
    );
} export default FormBoxMovement;