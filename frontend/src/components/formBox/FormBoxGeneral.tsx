import { Form, Dropdown } from 'react-bootstrap';
import InformationSource from "../InformationSource";
import Card from 'react-bootstrap/Card';
import styles from '../FormComponents.module.scss';
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
        optionsList?: Array<{ value: string; label: string }>;
    },
    setValues?: any
}

function FormBoxGeneral<T extends string>({ isNumericInput = false, options, setValues }: Props<T>) {

    const informationSourceBaseLabel = "L’information n’est pas dans le document, je n’ai pas les connaissances ni accès à des sources d’information externes pour répondre."
    const [informationSourceBase, setInformationSourceBase] = useState(false);
    const [displayInformationSource, setDisplayInformationSource] = useState<any>(false);
    const [selectedValue, setSelectedValue] = useState<string>(""); // Ajout de l'état selectedValue
    

    // const setOptionValue = (value: any) => {
    //     if (selectedValue !== value) {
    //         console.log("Valeur sélectionnée actuelle :", selectedValue);
    //         console.log("Valeur actuelle des options :", options.value);
    //         }
    //     console.log("setOptionValue appelé avec la valeur :", value);
    //     if (value !== selectedValue) {
    //         // Met à jour selectedValue
    //         setSelectedValue(value);

    //         if (typeof value === 'number') {
    //             setDisplayInformationSource(value > 0);
    //         }
    //         else if (Date.parse(value)) {
    //             setDisplayInformationSource(value != "");
    //         }
    //         else if (value == "")
    //             setDisplayInformationSource(false);

    //         //     options.value = value;
    //         //     setValues(options);
    //         // };
            
    //         // Met à jour la valeur dans options
    //         options.value = value;
    //         console.log("value", value);

    //         // Utilise setValues pour mettre à jour l'état dans le parent
    //         setValues((prevValues: any) => ({
    //             ...prevValues,
    //             [options.id]: value, // Enregistre la valeur par nom
    //         }));
    //         console.log("Valeurs mises à jour dans setValues :", {
    //             [options.id]: value,
    //         });
    //     }
    // };

    const setOptionValue = (value: any) => {
        // if (selectedValue !== value) {
        //     console.log("Valeur sélectionnée actuelle :", selectedValue);
        //     console.log("Valeur actuelle des options :", options.value);
        // }
    
        console.log("setOptionValue appelé avec la valeur :", value);
    
        // Vérifier que value n'est pas identique à selectedValue
        if (value !== selectedValue) {
            // Met à jour selectedValue
            setSelectedValue(value);
    
            // Gestion de l'affichage de l'information
            if (typeof value === 'number') {
                setDisplayInformationSource(value > 0);
            } else if (Date.parse(value)) {
                setDisplayInformationSource(value !== "");
            } else if (value === "") {
                setDisplayInformationSource(false);
            }
    
            // Utilise setValues pour mettre à jour l'état dans le parent
            setValues((prevValues: any) => {
                console.log("je rentre dans setValues");
                console.log("Valeurs avant mise à jour :", prevValues);
                const updatedValues = {
                    ...prevValues,
                    [options.id]: value, // Enregistre la valeur par ID
                };
                console.log("Valeurs mises à jour dans setValues :", updatedValues);
                return updatedValues;
            });
        }
    };

    const handleKeyPress = (e: any) => {
        console.log("Touche pressée :", e.code);
        if (e.code === "Enter" || e.code === "Space") {
            {
                setDisplayInformationSource(true);
            }
        }
    };

    const setSourceData = (sourceData: any) => {
        console.log("source data reçue", sourceData);
        options.informationSourceData = sourceData;
        setValues(options);
        console.log("options après mise à jour :", options);
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
    } else if (options.type === 'select') {
        card = (
            <Card.Body>
                <Form.Group controlId={options.controlId}>
                    <Form.Label className={styles.required}>{options.name}</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle className={`${styles.dropdownToggle} ${styles.dropdownField}`} id={options.id}>
                            {selectedValue || options.placeholder}

                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {options.optionsList && options.optionsList.map((option) => (
                                <Dropdown.Item key={option.value} onClick={() => setOptionValue(option.value)}>
                                    {option.label}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <InformationSourceBase label={informationSourceBaseLabel} setSourceBaseValue={setInformationSourceBase}></InformationSourceBase>
                </Form.Group>
            </Card.Body>
        );
    } else {
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