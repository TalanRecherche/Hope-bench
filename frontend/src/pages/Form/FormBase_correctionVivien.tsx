import { useState } from "react";
import { Navbar, Button } from "react-bootstrap";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import styles from './SimulationForm.module.scss';
import classNames from 'classnames';
import { FormData} from '../../model/simulationDataModel';
import uploadImage from '../../assets/upload.svg';
import planeImage from '../../assets/avion.svg';


function FormBase() {

    const navigate = useNavigate();
    const location = useLocation();
    // console.log("Valeurs reçues:", location.state);

    const [formDataValues, setFormDataValues] = useState<FormData>
        ({
            formName: location.state?.formName,
            formStatus: location.state?.status,
            generalBoxData: location.state?.generalData || {},
            movementBoxData: location.state?.movementData || {},
            digitalBoxData: location.state?.digitalData || {},
            officeData: location.state?.officeData || {},
        });

    console.log("Valeurs initiales dans FormBase:", formDataValues);

    const redirect = (link: string, e: any) => {
        setCurrentEntry(e.target.id);
        navigate(link, {
            state: {
                status: formDataValues.formStatus,
                generalData: formDataValues.generalBoxData,
                movementData: formDataValues.movementBoxData,
                digitalData: formDataValues.digitalBoxData,
                officeData: formDataValues.officeData,
            }
        });
    };

    // const save = () => {
    //     console.log("Enregistrement des données:", formDataValues.generalBoxData);
    // };

    // const formSubmit = () => {
    //     console.log("Soumission du formulaire avec les données:", formDataValues);
    // };

    // const receiveFormData = (receivedData: any) => {

    //     switch (currentEntry) {
    //         case "general":
    //             formDataValues.generalBoxData = receivedData;
    //             setFormDataValues(formDataValues);
    //             break;
    //         case "movement":
    //             formDataValues.movementBoxData = receivedData;
    //             setFormDataValues(formDataValues);
    //             break;
    //         case "digital":
    //             formDataValues.digitalBoxData = receivedData;
    //             setFormDataValues(formDataValues);
    //             break;
    //         case "office":
    //             formDataValues.officeData = receivedData;
    //             setFormDataValues(formDataValues);
    //             break;
    //     };
    // }

    const receiveFormData = (receivedData: any) => {
        console.log("Données reçues dans receiveFormData:", receivedData);
        console.log("État avant mise à jour:", formDataValues);

        setFormDataValues((prevValues) => {
            const updatedValues = {
                ...prevValues,
                [currentEntry === "generalTab" ? "generalBoxData" :
                    currentEntry === "movementTab" ? "movementBoxData" :
                        currentEntry === "digitalTab" ? "digitalBoxData" :
                            "officeData"]: receivedData,
            };

            console.log("État après mise à jour:", updatedValues);
            console.log("Valeurs dans FormBase après mise à jour :", formDataValues);
            return updatedValues;
        });
    };



    const getInitialEntry = () => {

        let pathNameSplited = location.pathname.split("/");
        console.log("Chemin d'accès analysé pour getInitialEntry:", pathNameSplited);
       
        if (pathNameSplited.length > 0) {
            return pathNameSplited[2];
        }
        return "generalTab";
    }

    const [currentEntry, setCurrentEntry] = useState(getInitialEntry());

    return (
        <form>
            <Navbar bg="$color-gray" className={styles.navBar} >

                <div className={styles.leftContainer}>

                    {/* Bouton pour le PDF */}
                    <div className={styles.pdfContainer}>
                        <a href="path/to/your/document.pdf" target="_blank" rel="noopener noreferrer" className={styles.pdfButton}>
                            Document à étudier
                            <img src={uploadImage} alt="télécharger" className={styles.pdfButtonImage} />
                        </a>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className={styles.infoContainer}>
                        <span className={styles.label}>
                            Dernière mise à jour: <span className={styles.labelValue}>{location.state?.lastUpdate?.toLocaleDateString()}</span>
                        </span>
                        <span className={styles.label}>
                            Format: <span className={styles.labelValue}>{location.state?.format}</span>
                        </span>
                        <span className={styles.label}>
                            Nombre de pages: <span className={styles.labelValue}>{location.state?.numberOfPages}</span>
                        </span>
                    </div>
                </div>

                <div className={styles.formNav}>
                    <div className={styles.formTabButtons}>
                        <Button
                            id="generalTab"
                            variant="light"
                            className={classNames(`me-1`, (currentEntry === "generalTab") ? styles.selectedButton : styles.unselectedButton)}
                            onClick={(e) => redirect("/form/generalTab", e)}
                        >
                            GÉNÉRAL
                        </Button>
                        <Button
                            id="movementTab" variant="light"
                            className={classNames(`me-1`, (currentEntry == "movementTab") ? styles.selectedButton : styles.unselectedButton)}
                            onClick={(e) => redirect("/form/movementTab", e)}> <img src={planeImage} alt="avion" className={styles.imgButton} />DÉPLACEMENT
                        </Button>
                        <Button
                            id="digitalTab" variant="light"
                            className={classNames(`me-1`, (currentEntry == "digitalTab") ? styles.selectedButton : styles.unselectedButton)}
                            onClick={(e) => redirect("/form/digitalTab", e)}> <img src={planeImage} alt="avion" className={styles.imgButton} />NUMÉRIQUE
                        </Button>
                        <Button id="officeTab" variant="light"
                            className={classNames(`me-1`, (currentEntry == "officeTab") ? styles.selectedButton : styles.unselectedButton)}
                            onClick={(e) => redirect("/form/officeTab", e)}> <img src={planeImage} alt="avion" className={styles.imgButton} />BUREAU
                        </Button>
                    </div>
                    {/* <div className={styles.formTabButtons}>
                        <Button className={classNames(styles.saveButton, (formDataValues.formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')} onClick={save}>Enregistrer</Button>
                        <Button className={classNames(styles.submitButton, (formDataValues.formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')} onClick={formSubmit}>Soumettre</Button>
                        <Button id="goToDashboard" className={styles.deleteButton} onClick={(e) => redirect("/dashboard", e)}>X</Button>
                    </div> */}
                </div>
            </Navbar>
            <Outlet context={{ datat: formDataValues, setDatat: receiveFormData }} />
        </form >
    );
}
export default FormBase;

export type FormDataContext = { datat: FormData, setDatat: (data: any)=>void };