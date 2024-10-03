import { Navbar } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { Outlet, useNavigate } from "react-router-dom";
import './SimulationForm.module.css';
import styles from './SimulationForm.module.css';
import React, { useState } from "react";
import classNames from 'classnames';

function FormBase() {

    const navigate = useNavigate();
    const redirect = (link: string, e: any) => {
        setCurrentEntry(e.target.id);
        navigate(link,);
    };

    const save = (data: any) => {
        // console.log("saving");
        console.log("save data = ", data);
    };

    const [data, setData] = React.useState([]);
    const setDatat = (receivedData: any) => {
        setData(receivedData);
        //console.log("outlet Data =", data);
    }

    const formSubmit = () => {
        console.log("formSubmit = ", data);
    }

    const [currentEntry, setCurrentEntry] = useState('');

    return (
        <form onSubmit={formSubmit}>
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
                        <Button className={styles.saveButton} onClick={save} type="button">Enregistrer</Button>
                        <Button className={styles.submitButton} type="submit">Soumettre</Button>
                        <Button className={styles.deleteButton} onClick={() => redirect("/dashboard", "")}>X</Button>
                    </div>
                </div>
            </Navbar>
            <Outlet context={{ setDatat }} />
        </form >
    )
}
export default FormBase;