import Form from 'react-bootstrap/Form';
import * as NumericInput from "react-numeric-input";
import styles from './InformationSource.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useEffect, useState } from 'react';

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

    const [iSourceData, setISourceData] = useState({});

    const changeFormData = (e: any) => {
        const { name, checked } = e.target;

        setISourceData({
            ...iSourceData,
            [name]: checked
        });

    };

    useEffect(() => {
        setSourceValues(iSourceData);
    });

    switch (informationSourceType) {
        case InformationSourceTypes.fromDeduction:
            return (
                <Form>
                    <Form.Check
                        reverse
                        name="foundInClientDocument"
                        inline
                        label="J’ai trouvé cette information dans le document Client"
                        type="switch"
                        id="find-in-document"
                        onChange={(e) => changeFormData(e)}
                    />
                    <br />
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
                </Form>);
        case InformationSourceTypes.fromCollaborator:
            return (
                <Form>
                    <Form.Check
                        name="foundInClientDocument"
                        reverse
                        inline
                        label="J’ai trouvé cette information dans le document"
                        type="switch"
                        id="find-in-document"
                        onChange={(e) => changeFormData(e)}
                    />
                    <div>
                        <span className={styles.required}> Cette information est issue de </span>
                        <DropdownButton variant="outline-secondary" size="sm" id="dropdown-basic-button" title="Alan Parks">
                            <Dropdown.Item href="#/action-1">Alan Parks 1</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Alan Parks 2</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Alan Parks 3</Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <Form.Check className={styles.required}
                        required
                        reverse
                        inline
                        label="J’estime la fiabilité de ma réponse sur une échelle de 1 à 5"
                        type="switch"
                        id="reliability-estimate"
                    />
                </Form>
            );
        default:
            return (
                <Form>
                    <div> default case with {informationSourceType} </div>
                    <Form.Check
                        reverse
                        inline
                        name="foundInClientDocument"
                        label="J’ai trouvé cette information dans le document"
                        type="switch"
                        id="find-in-document"
                        onChange={(e) => changeFormData(e)}
                    />
                    <br />
                    <span> À quelle page ? </span><NumericInput min={0} max={2} value={5} size={1} />
                    <br />
                    <Form.Check
                        reverse
                        inline
                        name="enrichedFromDocument"
                        type="switch"
                        label="J’ai enrichi ma saisie par des informations non présentes dans le document"
                        id="find-out-of-document"
                        onChange={(e) => changeFormData(e)}
                    />
                </Form>
            );
    };
}
export default InformationSource