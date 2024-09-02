import Form from 'react-bootstrap/Form';
import * as NumericInput from "react-numeric-input";
import styles from './InformationSource.module.css';

interface Props<T> {
    isDefaultInformationSource: T
}

function InformationSource<T extends boolean>({ isDefaultInformationSource }: Props<T>) {

    if (isDefaultInformationSource) {
        return (
            <Form>
                <Form.Check
                    reverse
                    inline
                    label="J’ai trouvé cette information dans le document Client"
                    type="switch"
                    id="find-in-document"
                />
                <br />
                <a> À quelle page ? </a><NumericInput min={0} max={2} value={5} size={1} />
                <br />
                <Form.Check
                    reverse
                    inline
                    type="switch"
                    label="J’ai enrichi ma saisie par des informations non présentes dans le document"
                    id="find-out-of-document"
                />
            </Form>
        );
    }
    else {
        return (
            <Form>
                <Form.Check
                    reverse
                    inline
                    label="J’ai trouvé cette information dans le document Client"
                    type="switch"
                    id="find-in-document"
                />
                <br />
                <Form.Check className={styles.informationLabel}
                    inline
                    type="checkbox"
                    label="J’ai déduit ma réponse en lisant le document"
                    id="deduced-from-document"
                />
                <Form.Check className={styles.informationLabel}
                    type="checkbox"
                    label="J’ai utilisé mes propres connaissances"
                    id="deduced-from-knowledge"
                />
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
    }

}
export default InformationSource