import { useState} from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import InformationSource from "../InformationSource";
import InformationSourceBase from '../InformationSourceBase';
import Card from 'react-bootstrap/Card';
import NumericInput from 'react-numeric-input';
import styles from '../FormComponents.module.scss';
import { InformationSourceData, FormBoxData } from '../../model/simulationDataModel';

interface Props<T> {
    isNumericInput?: boolean,
    options: {
        controlId?: string;
        name: string;
        subtitle?: string;
        type: string;
        id: string;
        placeholder: string;
        value: T;
        informationSourceData?: InformationSourceData;
        optionsList?: Array<{ value: T; label: string }>;
    },
    setValues?: (data: FormBoxData<T>) => void
}

function FormBoxGeneral<T>({ isNumericInput = false, options, setValues = () => {} }: Props<T>) {
    const informationSourceBaseLabel = "L’information n’est pas dans le document, je n’ai pas les connaissances ni accès à des sources d’information externes pour répondre."
    const [informationSourceBase, setInformationSourceBase] = useState(false);
    const [displayInformationSource, setDisplayInformationSource] = useState<any>(false);
    const [selectedValue, setSelectedValue] = useState<T>(options.value); // Ajout de l'état selectedValue


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
            setValues({
                id: options.id, value, informationSource: options.informationSourceData
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

    const setSourceData = (sourceData: InformationSourceData) => {
        console.log("source data reçue", sourceData);
        setValues({
            id: options.id, value: selectedValue, informationSource: sourceData
        });
        console.log("options après mise à jour :", options);
    }

    let card;
    if (isNumericInput) {
        card =
            <Card.Body >
                <a className={`${styles.required}`}>{options.name} </a>
                {options.subtitle && <div className={styles.subtitle}>{options.subtitle}</div>} {/* Affichage du subtitle */}
                <div className="mt-3">
                    <NumericInput min={0} size={1} onChange={(value) => setOptionValue(value)} />
                    <Form.Label className={`${styles.nameCard}`}>Jour/semaine/mois</Form.Label>
                </div>
                <InformationSourceBase label={informationSourceBaseLabel} setSourceBaseValue={setInformationSourceBase}></InformationSourceBase>
            </Card.Body>;
    } else if (options.type === 'select') {
        card = (
            <Card.Body>
                <Form.Group controlId={options.controlId}>
                    <Form.Label className={`${styles.required} ${styles.nameCard}`}>{options.name}</Form.Label>
                    {options.subtitle && <div className={`${styles.subtitle}`}>{options.subtitle}</div>} {/* Affichage du subtitle */}
                    <div className={`mt-3 ${styles.dropdownContainer}`}>
                        <Dropdown>
                            <Dropdown.Toggle className={`${styles.dropdownToggle} ${styles.dropdownField} ${styles.customDropdown}`} id={options.id}>
                                <span className={`${styles['dropdown-toggle-label']}`}>
                                    {selectedValue as string|| options.placeholder}
                                </span>
                                <span className={`${styles['dropdown-toggle-arrow']}`}>
                                    {/* Vous pouvez utiliser une icône ici si nécessaire */}
                                    <i className="bi bi-chevron-down"></i> {/* Exemple avec Bootstrap Icons */}
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {options.optionsList && options.optionsList.map((option) => (
                                    <Dropdown.Item
                                        key={option.value as string}
                                        onClick={() => setOptionValue(option.value)}
                                        className={styles.dropdownItem}
                                    >
                                        {option.label}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <InformationSourceBase label={informationSourceBaseLabel} setSourceBaseValue={setInformationSourceBase}></InformationSourceBase>
                </Form.Group>
            </Card.Body>
        );
    } else {
        card =
            <Card.Body >
                <Form.Group controlId={options.controlId}>
                    <Form.Label className={styles.required}>{options.name}</Form.Label>
                    {options.subtitle && <div className={styles.subtitle}>{options.subtitle}</div>} {/* Affichage du subtitle */}
                    <Form.Control
                        type={options.type}
                        id={options.id}
                        placeholder={options.placeholder}
                        onChange={(e) => setOptionValue(e.target.value)}
                        className="mt-3"
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