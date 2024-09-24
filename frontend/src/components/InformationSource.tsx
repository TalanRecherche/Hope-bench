import Form from 'react-bootstrap/Form';
import * as NumericInput from "react-numeric-input";
import styles from './FormComponents.module.css';
import { useEffect, useState } from 'react';
import SourceCustomSwitch from './genericCustom/SourceCustomSwitch';
import { InformationSourceData } from '../model/generalDataModel';

export enum InformationSourceTypes {
    default = 'default',
    fromDeduction = 'fromDeduction',
    fromCollaborator = 'deffromCollaboratorault'
}

interface Props {
    informationSourceType: InformationSourceTypes,
    setSourceValues?: any
}

function InformationSource({ informationSourceType, setSourceValues }: Props) {

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
    }


    function isChecked(name: string): boolean {
        console.log(informationSourceType);
        if (iSourceData && name in iSourceData && iSourceData[name as keyof InformationSourceData]) {
            return true;
        }
        return false;
    }

    return (
        <Form>
            <Form.Group>
                <Form.Label>J’ai trouvé cette information dans le document</Form.Label>
                <SourceCustomSwitch sendSwitchValue={(e: any) => handleSwitch(e, "foundInClientDocument",)} floatingContainer={true}></SourceCustomSwitch>
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
                    <Form.Check className={styles.required}
                        required
                        reverse
                        inline
                        label="J’estime la fiabilité de ma réponse sur une échelle de 1 à 5"
                        type="switch"
                        id="reliability-estimate"
                    />
                </>
            }
            {isChecked("foundInClientDocument") &&
                <>
                    <span> À quelle page ? </span><NumericInput min={0} max={2} value={5} size={1} />
                    <br />
                    <Form.Group>
                        <Form.Label>J’ai enrichi ma saisie par des informations non présentes dans le document</Form.Label>
                        <SourceCustomSwitch
                            sendSwitchValue={(e: any) => handleSwitch(e, "enrichedFromDocument",)}
                            floatingContainer={true}
                            initialValue={isChecked("enrichedFromDocument")}
                        ></SourceCustomSwitch>
                    </Form.Group>
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
                    <Form.Check className={styles.required}
                        required
                        reverse
                        inline
                        label="J’estime la fiabilité de ma réponse sur une échelle de 1 à 5"
                        type="switch"
                        id="reliability-estimate"
                    />
                </>
            }
        </Form>
    );
};
export default InformationSource