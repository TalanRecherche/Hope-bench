import styles from '../FormComponents.module.scss';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import StartingModalStage from "./StartingModalStage";

interface Props {
    open: boolean;
    onClose: any;
}

const StartingModal = ({ open, onClose }: Props) => {

    const MAX_STAGE_FORM_INDEX = 2;
    const [formStage, setFormStage] = useState(0);

    const nextStage = () => {
        if (formStage < MAX_STAGE_FORM_INDEX) {
            setFormStage(() => formStage + 1);
        }
    }

    function previousStage() {
        if (formStage > 0) {
            setFormStage(() => formStage - 1);
        }
    }

    const handleAccept = () => {
        onClose();
    }

    return (
        <Modal show={open}>
            <Modal.Header style={{ borderBottom: 'none' }}>
                <div className={styles.modalTitle} >Onboarding</div>
                <div className={styles.modalPageNumber} > {formStage + 1} / {MAX_STAGE_FORM_INDEX + 1}</div>
            </Modal.Header>
            <Modal.Body className={styles.modalText}>
                <StartingModalStage formStage={formStage}></StartingModalStage>
            </Modal.Body>
            <Modal.Footer className="me-auto" style={{ borderTop: 'none' }}>
                {
                    formStage != 0 &&
                    <button type="button" className={styles.modalPrevious} onClick={previousStage}>Précédent</button>
                }
                {
                    formStage != 2 &&
                    <button type="button" className={styles.modalNext} onClick={nextStage}>Suivant</button>
                }
                {
                    formStage == 2 &&
                    <button type="button" className={styles.modalNext} onClick={handleAccept}>Accepter</button>
                }
            </Modal.Footer>
        </Modal>
    )
}
export default StartingModal;

