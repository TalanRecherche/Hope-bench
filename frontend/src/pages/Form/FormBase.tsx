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
            <Navbar bg="#E7E7E7" className={styles.navBar} >
                <div className={styles.formNav}>
                    <div className={styles.formTabButtons}>
                        <Button variant="underline" className={styles.formTabSingleButton} onClick={() => redirect("/form/generalTab")}>GÉNÉRAL</Button>
                        <Button variant="underline" className={styles.formTabSingleButton} onClick={() => redirect("/form/movementTab")}>DÉPLACEMENT</Button>
                        <Button variant="underline" className={styles.formTabSingleButton} onClick={() => redirect("/form/digitalTab")}>NUMÉRIQUE</Button>
                        <Button variant="underline" className={styles.formTabSingleButton} onClick={() => redirect("/form/officeTab")}>BUREAU</Button>
                    </div>
                    <div className={styles.formTabButtons}>
                        <Button className={styles.saveButton} onClick={save} type="button">Enregistrer</Button>
                        <Button className={styles.submitButton} type="submit">Soumettre</Button>
                        <Button className={styles.deleteButton} onClick={() => redirect("/dashboard")}>X</Button>
                    </div>

                </div>
            </Navbar>
            <Outlet context={{ setDatat }} />
        </form>
    )
}
export default FormBase;