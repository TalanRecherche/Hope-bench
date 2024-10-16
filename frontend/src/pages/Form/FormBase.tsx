import { Navbar } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import './SimulationForm.module.css';
import styles from './SimulationForm.module.css';
import { useState } from "react";
import classNames from 'classnames';
import { FormData, FormStatus } from '../../model/simulationDataModel';

function FormBase() {

    const navigate = useNavigate();
    const location = useLocation();

    const [formDataValues, setFormDataValues] = useState<FormData>({ formName: location.state?.formName, formStatus: location.state?.status });

    const redirect = (link: string, e: any) => {
        setCurrentEntry(e.target.id);
        navigate(link, {
            state: {
                status: formDataValues.formStatus
            }
        });
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
                formDataValues.officeData = receivedData;
                setFormDataValues(formDataValues);
                break;
        };
    }

    const formSubmit = () => {
        console.log("Submitting = ", formDataValues);
    }

    const getInitialEntry = () => {
        let pathNameSplited = location.pathname.split("/");
        if (pathNameSplited.length > 0) {
            return pathNameSplited[2];
        }
        return "generalTab";
    }

    const [currentEntry, setCurrentEntry] = useState(getInitialEntry());

    return (
        <form>
            <Navbar bg="#E7E7E7" className={styles.navBar} >
                <div className={styles.formNav}>
                    <div className={styles.formTabButtons}>
                        <Button
                            id="generalTab" variant="underline"
                            className={classNames(styles.formTabSingleButton, (currentEntry == "generalTab") ? styles.formTabCurrentEntry : '')}
                            onClick={(e) => redirect("/form/generalTab", e)}> GÉNÉRAL
                        </Button>
                        <Button
                            id="movementTab" variant="underline"
                            className={classNames(styles.formTabSingleButton, (currentEntry == "movementTab") ? styles.formTabCurrentEntry : '')}
                            onClick={(e) => redirect("/form/movementTab", e)}> DÉPLACEMENT
                        </Button>
                        <Button
                            id="digitalTab" variant="underline"
                            className={classNames(styles.formTabSingleButton, (currentEntry == "digitalTab") ? styles.formTabCurrentEntry : '')}
                            onClick={(e) => redirect("/form/digitalTab", e)}> NUMÉRIQUE
                        </Button>
                        <Button id="officeTab" variant="underline"
                            className={classNames(styles.formTabSingleButton, (currentEntry == "officeTab") ? styles.formTabCurrentEntry : '')}
                            onClick={(e) => redirect("/form/officeTab", e)}> BUREAU
                        </Button>
                    </div>
                    <div className={styles.formTabButtons}>
                        <Button className={classNames(styles.saveButton, (formDataValues.formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')} onClick={save}>Enregistrer</Button>
                        <Button className={classNames(styles.submitButton, (formDataValues.formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')} onClick={formSubmit}>Soumettre</Button>
                        <Button id="goToDashboard" className={styles.deleteButton} onClick={(e) => redirect("/dashboard", e)}>X</Button>
                    </div>
                </div>
            </Navbar>
            <Outlet context={{ setDatat: receiveFormData }} />
        </form >
    );
}
export default FormBase;