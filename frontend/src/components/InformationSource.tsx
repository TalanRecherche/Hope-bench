import Form from 'react-bootstrap/Form';
import NumericInput from "react-numeric-input";
import styles from './FormComponents.module.scss';
import { useEffect, useState } from 'react';
import CustomStarRating from './genericCustom/CustomStartRating';
import { InformationSourceData, InformationOriginType } from '../model/simulationDataModel';
import iconLabel from "../assets/label.svg";
import classNames from 'classnames';

interface Props {
    setSourceValues?: (data: InformationSourceData) => void
}

function InformationSource({ setSourceValues }: Props) {

    const [iSourceData, setISourceData] = useState<InformationSourceData>({});

    useEffect(() => {
        setSourceValues && setSourceValues(iSourceData);
    });

    const changeFormData = (e: any) => {
        const { name, checked } = e.target;

        setISourceData({
            ...iSourceData,
            [name]: checked
        });
    };

    const radioChangeFormData = (e: any) => {
        const { name, id } = e.target;

        setISourceData({
            ...iSourceData,
            [name]: id
        });
    };

    function handleSwitch(checked: boolean, name: keyof InformationSourceData) {
        setISourceData({
            ...iSourceData,
            [name]: checked
        });
    };

    function handleNumericInput(value: any, name: keyof InformationSourceData) {
        setISourceData({
            ...iSourceData,
            [name]: value
        });
    };

    function isSourceType(type: InformationOriginType): boolean {
        return iSourceData.informationOrigin == type;
    }

    return (
        <>
            <Form.Group className={styles.labelSemiBold}>
                <img src={iconLabel} className={styles.iconLabel} />
                <Form.Label> L’information que j’ai saisie : </Form.Label>
            </Form.Group>
            <Form.Check
                name="informationOrigin"
                type="radio"
                label="est entièrement ou partiellement présente dans le document."
                id="foundInDocument"
                onChange={(e) => radioChangeFormData(e)}
            />
            <Form.Check
                name="informationOrigin"
                type="radio"
                label="n’est pas présente dans le document, j’ai fait appel à mes propres connaissances, celle de mes collaborateurs ou d’autres sources pour répondre."
                id="deducedFromknowledge"
                onChange={(e) => radioChangeFormData(e)}
            />
            {isSourceType(InformationOriginType.fromKnowledge) &&
                <>
                    <Form.Group className={styles.marginTop15}>
                        <img src={iconLabel} className={styles.iconLabel} />
                        <Form.Label className={styles.required}> J’estime la fiabilité de ma réponse sur une échelle de 1 à 5</Form.Label>
                        <CustomStarRating sendRatingValue={(e: any) => handleSwitch(e, "reliabilityRate")}></CustomStarRating>
                    </Form.Group>
                </>
            }
            {isSourceType(InformationOriginType.fromDocument) &&
                <>
                    <Form.Group className={classNames(styles.sourcePageInputs, styles.labelSemiBold)}>
                        <img src={iconLabel} className={styles.iconLabel} />
                        <Form.Label>À quelle page ?</Form.Label>
                        <div>
                            <NumericInput className={styles.onPageNumericeInput}
                                style={{
                                    input: {
                                        height: 24, width: 60

                                    }
                                }}
                                min={0} placeholder='0' size={2} onChange={(e) => handleNumericInput(e, "foundOnPage")} />
                        </div>
                    </Form.Group >
                    <Form.Group className={styles.labelSemiBold}>
                        <img src={iconLabel} className={styles.iconLabel} />
                        <Form.Label> J’ai enrichi ma saisie par des informations non présentes dans le document ? </Form.Label>
                    </Form.Group>
                    <Form.Check
                        name="isInformationEnriched"
                        type="radio"
                        label="Non"
                        id="false"
                        onChange={(e) => radioChangeFormData(e)}
                    />
                    <Form.Check
                        name="isInformationEnriched"
                        type="radio"
                        label="Oui"
                        id="true"
                        onChange={(e) => radioChangeFormData(e)}
                    />

                    {iSourceData.isInformationEnriched === "true" &&
                        <>
                            <Form.Group className={classNames(styles.marginTop15, styles.labelSemiBold)}>
                                <img src={iconLabel} className={styles.iconLabel} />
                                <Form.Label> Préciser : </Form.Label>
                            </Form.Group>

                            <Form.Check
                                inline
                                name="enrichedBasedOnTheDocument"
                                type="checkbox"
                                label="En faisant une déduction qui s’appuie sur la lecture du document."
                                id="deducedFromDocument"
                                onChange={(e) => changeFormData(e)}
                            />
                            <Form.Check
                                name="enrichedFromKnowledge"
                                type="checkbox"
                                label="En faisant appel à mes propres connaissances, celle de mes collaborateurs ou d’autres sources."
                                id="deducedFromknowledge"
                                onChange={(e) => changeFormData(e)}
                            />
                            <Form.Group className={classNames(styles.marginTop15, styles.labelSemiBold)}>
                                <img src={iconLabel} className={styles.iconLabel} />
                                <Form.Label className={styles.required}> J’estime la fiabilité de ma réponse sur une échelle de 1 à 5</Form.Label>
                                <CustomStarRating sendRatingValue={(e: any) => handleSwitch(e, "enrichedReliabilityRate")}></CustomStarRating>
                            </Form.Group>

                        </>
                    }
                </>
            }
        </>
    );
};
export default InformationSource