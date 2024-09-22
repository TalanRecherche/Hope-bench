import { Navbar } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { Outlet, useNavigate } from "react-router-dom";
import './SimulationForm.module.css';
import styles from './SimulationForm.module.css';
import React from "react";
import context from "react-bootstrap/esm/AccordionContext";


function FormBase() {
    
    const navigate = useNavigate();
    const redirect = (link: string) => {        
        console.log("context =", context);
        navigate(link,);
    };

    const save = (data: any) => {
        console.log("saving");
        console.log("save data = ", data);
    };

    const [data, setData] = React.useState([]);
    const setDatat = (receivedData: any) => {
        setData(receivedData);
        console.log("outlet Data =", data);
    }

    const formSubmit = () => {        
        console.log("formSubmit = ", data);
    }

    return (
        <form onSubmit={formSubmit}>
            <Navbar bg="light" data-bs-theme="light">
                <div className={styles.left}>
                    <Button className={styles.marginLeftRight10} variant="underline" onClick={() => redirect("/form/generalTab")}>GÉNÉRAL</Button>
                    <Button variant="underline" onClick={() => redirect("/form/movementTab")}>DÉPLACEMENT</Button>
                    <Button variant="underline" onClick={() => redirect("/form/digitalTab")}>NUMÉRIQUE</Button>
                    <Button variant="underline" onClick={() => redirect("/form/officeTab")}>BUREAU</Button>
                    <div className={styles.submissionButtons}>
                        <Button className={styles.saveButton} onClick={save} type="button">Enregistrer</Button>
                        <Button className={styles.submitButton} type="submit">Soumettre</Button>
                        <Button className={styles.submitButton} onClick={() => redirect("/dashboard")}>X</Button>
                    </div>
                </div>
            </Navbar>
            <Outlet context={{ setDatat }} />
        </form>
    )
}
export default FormBase;