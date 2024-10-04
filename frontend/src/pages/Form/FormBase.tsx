import { Navbar } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import './SimulationForm.module.css';
import styles from './SimulationForm.module.css';
import { useState } from "react";
import classNames from 'classnames';
import { FormData } from '../../model/simulationDataModel';

function FormBase() {

    const navigate = useNavigate();
    const location = useLocation();

    const [formDataValues, setFormDataValues] = useState<FormData>({ formName: location.state?.formName });

    const redirect = (link: string, e: any) => {
        setCurrentEntry(e.target.id);
        navigate(link,);
    };

    const save = () => {
        console.log("saving data = ", formDataValues);
    };

    const receiveFormData = (receivedData: any) => {
        
        switch (currentEntry) {
            case "general":
                formDataValues.generalBoxData = receivedData;
                setFormDataValues(formDataValues);
            break;
            case "movement":
                formDataValues.movementBoxData = receivedData;
                setFormDataValues(formDataValues);
            break;
            case "digital":
                formDataValues.digitalBoxData = receivedData;
                setFormDataValues(formDataValues);
            break;
            case "office":
                formDataValues.officeDatta = receivedData;
                setFormDataValues(formDataValues);
            break;
        };        
    }

    const formSubmit = () => {
        console.log("Submitting = ", formDataValues);    }

    const [currentEntry, setCurrentEntry] = useState('general');

    return (
        <form>
            <Navbar bg="#E7E7E7" className={styles.navBar} >
                <div className={styles.formNav}>
                    <div className={styles.formTabButtons}>
                        <Button
                            id="general" variant="underline"
                            className={classNames(styles.formTabSingleButton, (currentEntry == "general") ? styles.formTabCurrentEntry : '')}
                            onClick={(e) => redirect("/form/generalTab", e)}> GÉNÉRAL
                        </Button>
                        <Button
                            id="movement" variant="underline"
                            className={classNames(styles.formTabSingleButton, (currentEntry == "movement") ? styles.formTabCurrentEntry : '')}
                            onClick={(e) => redirect("/form/movementTab", e)}> DÉPLACEMENT
                        </Button>
                        <Button
                            id="digital" variant="underline"
                            className={classNames(styles.formTabSingleButton, (currentEntry == "digital") ? styles.formTabCurrentEntry : '')}
                            onClick={(e) => redirect("/form/digitalTab", e)}> NUMÉRIQUE
                        </Button>
                        <Button id="office" variant="underline"
                            className={classNames(styles.formTabSingleButton, (currentEntry == "office") ? styles.formTabCurrentEntry : '')}
                            onClick={(e) => redirect("/form/officeTab", e)}> BUREAU
                        </Button>
                    </div>
                    <div className={styles.formTabButtons}>
                        <Button className={styles.saveButton} onClick={save}>Enregistrer</Button>
                        <Button className={styles.submitButton}  onClick={formSubmit}>Soumettre</Button>
                        <Button id="goToDashboard" className={styles.deleteButton} onClick={(e) => redirect("/dashboard", e)}>X</Button>
                    </div>
                </div>
            </Navbar>
            <Outlet context={{ setDatat: receiveFormData }} />
        </form >
    );    
}
export default FormBase;