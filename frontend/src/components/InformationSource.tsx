import Form from 'react-bootstrap/Form';
import NumericInput from "react-numeric-input";
import styles from './FormComponents.module.css';
import { useEffect, useState } from 'react';
import SourceCustomSwitch from './genericCustom/SourceCustomSwitch';
import CustomStarRating from './genericCustom/CustomStartRating';
import { InformationSourceData } from '../model/simulationDataModel';
import InputGroup from 'react-bootstrap/InputGroup';

export enum InformationSourceTypes {
    default = 'default',
    fromDeduction = 'fromDeduction',
    fromCollaborator = 'deffromCollaboratorault'
}

interface Props {
    informationSourceType: InformationSourceTypes,
    setSourceValues?: any
}

function InformationSource({ setSourceValues }: Props) {

    const [iSourceData, setISourceData] = useState<InformationSourceData>({});

    useEffect(() => {
        setSourceValues(iSourceData);
    });

    const changeFormData = (e: any) => {
        const { name, checked } = e.target;

        setISourceData({
            ...iSourceData,
            [name]: checked
        });
    };

    function handleSwitch(checked: boolean, name: string) {
        setISourceData({
            ...iSourceData,
            [name]: checked
        });
    };

    function handleNumericInput(value: any, name: string) {
        setISourceData({
            ...iSourceData,
            [name]: value
        });
    };

    function isChecked(name: string): boolean {
        if (iSourceData && name in iSourceData && iSourceData[name as keyof InformationSourceData]) {
            return true;
        }
        return false;
    }

    return (
        <Form className={styles.labelSemiBold}>
            <Form.Group>
                <Form.Label>J’ai trouvé cette information dans le document</Form.Label>
                <SourceCustomSwitch sendSwitchValue={(e: any) => handleSwitch(e, "foundInClientDocument")}></SourceCustomSwitch>
            </Form.Group>
            {!isChecked("foundInClientDocument") &&
                <>
                    <Form.Check className={styles.marginLeft20}
                        inline
                        name="deduceByReadingDocument"
                        type="checkbox"
                        label="J’ai déduit ma réponse en lisant le document"
                        id="deduced-from-document"
                        onChange={(e) => changeFormData(e)}
                    />
                    <Form.Check className={styles.marginLeft20}
                        name="personalKnowlegdeUsed"
                        type="checkbox"
                        label="J’ai utilisé mes propres connaissances"
                        id="deduced-from-knowledge"
                        onChange={(e) => changeFormData(e)}
                    />
                    <Form.Group>
                        <Form.Label className={styles.required} >J’estime la fiabilité de ma réponse sur une échelle de 1 à 5</Form.Label>
                        <CustomStarRating sendRatingValue={(e: any) => handleSwitch(e, "reliabilityRate")}></CustomStarRating>
                    </Form.Group>
                </>
            }
            {isChecked("foundInClientDocument") &&
                <>
                    <InputGroup className={ styles.sourcePageInputs }>
                        <span > À quelle page ? </span>
                        <NumericInput className={styles.numericInput} style={{ input: { height: 24, width: 88 }}}
                            min={0} placeholder='0' size={2} onChange={(e) => handleNumericInput(e, "foundOnPage")} />
                    </InputGroup>
                    <Form.Label>J’ai enrichi ma saisie par des informations non présentes dans le document</Form.Label>
                    <SourceCustomSwitch
                        sendSwitchValue={(e: any) => handleSwitch(e, "enrichedFromDocument",)}
                        initialValue={isChecked("enrichedFromDocument")}
                    ></SourceCustomSwitch>
                </>
            }
            {(isChecked("foundInClientDocument") && isChecked("enrichedFromDocument")) &&
                <>
                    <Form.Check className={styles.marginLeft20}
                        inline
                        name="deduceByReadingDocument"
                        type="checkbox"
                        label="J’ai déduit ma réponse en lisant le document"
                        id="deduced-from-document"
                        onChange={(e) => changeFormData(e)}
                    />
                    <Form.Check className={styles.marginLeft20}
                        name="personalKnowlegdeUsed"
                        type="checkbox"
                        label="J’ai utilisé mes propres connaissances"
                        id="deduced-from-knowledge"
                        onChange={(e) => changeFormData(e)}
                    />
                    <Form.Group>
                        <Form.Label className={styles.required} >J’estime la fiabilité de ma réponse sur une échelle de 1 à 5</Form.Label>
                        <CustomStarRating sendRatingValue={(e: any) => handleSwitch(e, "reliabilityRate")}></CustomStarRating>
                    </Form.Group>

                </>
            }
        </Form>
    );
};
export default InformationSource