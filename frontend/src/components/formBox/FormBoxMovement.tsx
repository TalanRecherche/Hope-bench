import { useState, useEffect } from 'react';
import { Card, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';

import InformationSource from "../InformationSource";
import InformationSourceBase from '../InformationSourceBase';

import styles from '../FormComponents.module.scss';

import CustomSwitch from '../genericCustom/CustomSwitch';
import { CustomSwitchOptions, InformationSourceData, MovementBoxData } from '../../model/simulationDataModel';

// import classNames from 'classnames';
// import imgAvion from '../../assets/avion.svg';

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
    setBoxValues: (data: any) => void;
    showSwitch?: boolean;
}

function FormBoxMovement<T extends string>({ options, movementData, setBoxValues: setValues }: Props<T>) {
    const [profiles, setProfiles] = useState<any[]>([]); // État pour suivre les profils de consultants ajoutés

    const [movementBoxValues, setMovementBoxValues] = useState<MovementBoxData>({
        optionName: options.name,
        numberOfMovement: 0,
        averageKmPerTrip: 0,
        consultantProfiles: '',
        sourceData: null,
    });


    // Fonction pour ajouter un profil
    const handleAddProfile = () => {
        setProfiles(prevProfiles => [
            ...prevProfiles,
            {
                id: prevProfiles.length + 1, // ID unique pour chaque profil
                consultantProfiles: '',
                averageKmPerTrip: 0,
            }
        ]);
    };

    // Fonction pour gérer les changements dans les valeurs du profil
    const handleProfileChange = (value: any, name: string, index: number) => {
        const updatedProfiles = [...profiles];
        updatedProfiles[index] = { ...updatedProfiles[index], [name]: value };
        setProfiles(updatedProfiles);
    };



    // Gestion des variations (oui / non)
    const [variations, setVariations] = useState<'oui' | 'non'>('non');

    useEffect(() => {
        if (variations === 'oui') {
            // Si "Oui" est sélectionné, s'assurer qu'il y a 2 profils
            if (profiles.length === 0) {
                setProfiles([
                    { id: 1, consultantProfiles: '', averageKmPerTrip: 0 },
                    { id: 2, consultantProfiles: '', averageKmPerTrip: 0 },
                ]);
            } else if (profiles.length === 1) {
                setProfiles([
                    ...profiles,
                    { id: 2, consultantProfiles: '', averageKmPerTrip: 0 }, // Ajouter le second profil
                ]);
            }
        } else if (variations === 'non') {
            // Si "Non" est sélectionné, s'assurer qu'il y a 1 profil
            if (profiles.length > 1) {
                setProfiles([profiles[0]]); // Retirer tous les profils sauf le premier
            } else if (profiles.length === 0) {
                setProfiles([
                    { id: 1, consultantProfiles: '', averageKmPerTrip: 0 },
                ]);
            }
        }
    }, [variations]); // Réagir aux changements dans "variations"


    const switchOptions: CustomSwitchOptions = [
        { label: 'Hebdo', checked: true },
        { label: 'Mensuel', checked: false },
        { label: 'Global', checked: false }
    ];

    // Gérer le changement de l'option sélectionnée dans le switch
    // const handleSwitchChange = (value: string) => {
    //     setMovementBoxValues((prevValues) => ({
    //         ...prevValues,
    //         movementFrequency: value, // Met à jour la fréquence de mouvement
    //     }));

    //     if (setValues) {
    //         setValues({
    //             ...movementBoxValues,
    //             movementFrequency: value,
    //         });
    //     }
    // };

    const [displayInformationSource, ] = useState<any>(false);
    // const [kmInformationSourceBase, setKmInformationSourceBase] = useState(false);

    const [, setNbInformationSourceBase] = useState(false);
    // const kmInformationSourceBaseLabel = "Je suis incapable d’estimer le nombre de km même avec une marge d’erreur."
    const nbInformationSourceBaseLabel = "Je ne peux pas faire d'estimation cohérente, même avec une marge d'erreur."

    //Average
    // const [kmAverageInformationSourceBase, setKmAverageInformationSourceBase] = useState(false);
    // const kmAverageInformationSourceBaseLabel = "Je suis incapable d’estimer la moyenne de km même avec une marge d’erreur.";
    // const [, setDisplayAverageInformationSource] = useState<any>(false);

    const movementFrequencyDefault = switchOptions[0].label;

    function handleChange(value: any, name: string) {

        // if (typeof value === 'number') {
        //     setDisplayInformationSource(value > 0);
        // }
        // else if (Date.parse(value)) {
        //     setDisplayInformationSource(value != "");
        // }
        // else if (value == "") {
        //     setDisplayInformationSource(false);
        //     setDisplayAverageInformationSource(false);
        // }

        setMovementBoxValues({
            ...movementBoxValues,
            [name]: value
        });

        if (!movementBoxValues.movementFrequency) {
            setMovementBoxValues({
                ...movementBoxValues,
                ["movementFrequency"]: movementFrequencyDefault
            });
        }

        movementData = movementBoxValues;
        setValues(movementData);
    }



    // Fonction pour mettre à jour les valeurs de mouvement
    // const handleChange = (value: any, name: string) => {
    //     const updatedValues = { ...movementBoxValues, [name]: value };
    //     setMovementBoxValues(updatedValues);

    //     if (setValues) {
    //         setValues(updatedValues);
    //     }

    // };

    const setSourceData = (sourceData: any) => {
        movementBoxValues.informationSource = sourceData;
        movementData = movementBoxValues;
        setValues(movementData);
    }


    // Gérer l'affichage de la source d'information
    // const handleSourceData = (sourceData: any) => {
    //     setMovementBoxValues((prev) => ({
    //         ...prev,
    //         sourceData,
    //     }));
    // };

    // const handleKeyPress = (e: any) => {
    //     if (e.code === "Enter" || e.code === "Space") {
    //         {
    //             setDisplayAverageInformationSource(true);
    //         }
    //     }
    // };

    // Gérer la navigation
    

    return (
        <div className={styles.boxMovement}>
            {/* Card principale qui contient toutes les sections */}
            <Card style={{ borderRadius: "4px 4px 4px 4px" }} className={styles.boxItem}>
                <Card.Body>
                    <Form.Label className={styles.movementFieldLabel}>
                        {/* affichage de l'icône correspondant au moyen de transport coché */}
                        {
                            options.name.toLowerCase() === "avion" && (
                                <i className="bi bi-airplane-engines" style={{ marginRight: '10px' }} />
                            )
                        }
                        {
                            options.name.toLowerCase().includes("voiture") && (
                                <i className="bi bi-car-front" style={{ marginRight: '10px' }} />
                            )
                        }

                        {
                            (options.name.toLowerCase().includes("tgv") ||
                                options.name.toLowerCase().includes("train") ||
                                options.name.toLowerCase().includes("rer") ||
                                options.name.toLowerCase().includes("métro")) && (
                                <i className="bi bi-train-front" style={{ marginRight: '10px' }} />
                            )
                        }

                        {
                            options.name.toLowerCase().includes("bus") && (
                                <i className="bi bi-bus-front" style={{ marginRight: '10px' }} />
                            )
                        }

                        {
                            options.name.toLowerCase().includes("vélo") && (
                                <i className="bi bi-bicycle" style={{ marginRight: '10px' }} />
                            )
                        }
                        {options.name}
                    </Form.Label>


                    {/* Sous-Card pour la section "Nombre de personnes" */}
                    <Card style={{ marginTop: '20px' }} className={styles.subCard}>
                        <Card.Body>
                            <div className={styles.titleCard}>
                                Nombre de personnes ayant pris ce moyen de transport
                            </div>
                            <div className={styles.boxSubTitle}>
                                Si l'information n'est pas présente mais qu'il existe des indices, je fais une supposition.
                            </div>

                            <NumericInput
                                style={{ input: { textAlign: 'center' } }}
                                min={0}
                                size={1}
                                value={movementBoxValues.numberOfMovement}
                                onChange={(value) => handleChange(value, 'numberOfMovement')}
                            />

                            <InformationSourceBase label={nbInformationSourceBaseLabel} setSourceBaseValue={setNbInformationSourceBase}></InformationSourceBase>
                        </Card.Body>
                    </Card>

                    {/* Question sur les variations */}
                    <div className={styles.variationQuestion}>
                        <div className={styles.titleCard}>Existe-t-il des variations significatives de déplacement d'un consultant à l'autre ?</div>
                        <Form.Check
                            type="radio"
                            label="Oui"
                            name="variationGroup"
                            value="oui"
                            checked={variations === 'oui'}
                            onChange={() => setVariations('oui')}
                        />
                        <Form.Check
                            type="radio"
                            label="Non"
                            name="variationGroup"
                            value="non"
                            checked={variations === 'non'}
                            onChange={() => setVariations('non')}
                        />
                    </div>
                    <div className={styles.titleCard}>Quels sont les profils de consultants par typologie de déplacement?</div>


                    {/* Affichage dynamique des profils */}
                    {profiles.map((profile, index) => (
                        <div key={profile.id} className={styles.subCardsContainer}>
                            <div className={styles.titleCard}>
                                <i className="bi bi-person"></i> Profil Consultant - Typologie de déplacement {profile.id}
                            </div>

                            {/* Sous-Card pour la section "Nombre de consultants" */}
                            <Card style={{ marginTop: '20px' }} className={styles.subCard}>
                                <Card.Body>
                                    <div className={styles.titleCard}>Combien de consultant(s) pour cette typologie de déplacement ?</div>
                                    <NumericInput
                                        style={{ input: { textAlign: 'center' } }}
                                        min={0}
                                        size={1}
                                        value={profile.consultantProfiles}
                                        onChange={(value) => handleProfileChange(value, 'consultantProfiles', index)}
                                    />
                                </Card.Body>
                            </Card>

                            {/* Sous-Card pour la section "Nombre de voyages" */}
                            <Card style={{ marginTop: '20px' }} className={styles.subCard}>
                                <Card.Body>
                                    <div className={styles.titleCard}>Nombre de voyages aller pour un consultant type ?</div>
                                    <div className={styles.boxSubTitle}>Si l'information n'est pas présente mais qu'il existe des indices, je fais une supposition.</div>
                                    <NumericInput
                                        style={{ input: { textAlign: 'center' } }}
                                        min={0}
                                        size={1}
                                        value={profile.averageKmPerTrip}
                                        onChange={(value) => handleProfileChange(value, 'averageKmPerTrip', index)}
                                    />
                                    {(
                                        //pour gérer l'affichage du toggle 
                                        <CustomSwitch
                                            options={switchOptions}
                                            sendSwitchValue={(e: any) => handleChange(e, "movementFrequency",)}
                                            floatingContainer={false}
                                        />
                                    )}

                                </Card.Body>
                            </Card>

                            {/* Sous-Card pour la section "Moyenne de km" */}
                            <Card style={{ marginTop: '20px' }} className={styles.subCard}>
                                <Card.Body>
                                    <div className={styles.titleCard}>Moyenne de km par déplacement pour un consultant type</div>
                                    <div className={styles.boxSubTitle}>Si le résultat n'est pas précis, estimer avec une marge d'erreur de 200km</div>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            placeholder="Description"
                                            type="text"
                                            value={profile.averageKmPerTrip}
                                            onChange={(e) => handleProfileChange(e.target.value, 'averageKmPerTrip', index)}
                                        />
                                    </InputGroup>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}






                    {/* Bouton pour ajouter un profil seulement si oui est coché*/}
                    {variations === 'oui' && (
                        <Button onClick={handleAddProfile}>
                            Ajouter type +
                        </Button>
                    )}




                </Card.Body>
            </Card>


            {/* Affichage de la source d'information si activée */}
            {displayInformationSource && (
                <Card style={{ marginTop: '20px' }} className={styles.informationSource}>
                    <Card.Body>
                        <InformationSource setSourceValues={setSourceData} />
                    </Card.Body>
                </Card>
            )}



        </div>



    );
};
export default FormBoxMovement;