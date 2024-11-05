import { useContext} from "react";
// import { useState } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation} from "react-router-dom";

// import { FormListData} from '../model/simulationDataModel';
import { AuthContext } from "../contexts/AuthContext";
import styles from './FormComponents.module.scss';
import hopeImage from '../assets/hope.svg';
import classNames from 'classnames';

// import { FormData, FormListData } from '../model/simulationDataModel';

function NavBar() {
	const { user, logout } = useContext(AuthContext);
	
	// const navigate = useNavigate();
    const location = useLocation();


	let { formName } = location.state || {};
	const {name} = location.state || {};
	const formDataValues = location.state || {};

	// const formListDataD: FormListData = {
    //     name: location.state.formName,
    //     format: location.state.format,
    //     numberOfPages: location.state.numberOfPages,
    //     lastUpdate: new Date(location.state.lastUpdate), // Convertit en objet Date si nécessaire
    //     status: location.state.status,
       
    // };

	// const [formDataValues, setFormDataValues] = useState<FormData>
	// ({
	// 	formName: location.state?.formName,
	// 	formStatus: location.state?.status,
	// 	generalBoxData: location.state?.generalData || {},
	// 	movementBoxData: location.state?.movementData || {},
	// 	digitalBoxData: location.state?.digitalData || {},
	// 	officeData: location.state?.officeData || {},
	// 	formListData: formListDataD || {},
	// });


	console.log("navbar data formName",formName);
	
	console.log("navbar data name",name);

	console.log("navbar data formDataValues",formDataValues?.formListData?.name);

	
	if (formName==undefined){formName=formDataValues?.formListData?.name};


	// const formNameG=formDataValues.formListData.name|| {};

	// const formNameComplet = formNameG || formName;
	// console.log("navbar",formDataValues);
	

	// const formListDataD: FormListData = {
    //     name: location.state.formName,
    //     format: location.state.format,
    //     numberOfPages: location.state.numberOfPages,
    //     lastUpdate: new Date(location.state.lastUpdate), // Convertit en objet Date si nécessaire
    //     status: location.state.status,
    // };


    // const [formDataValues, setFormDataValues] = useState<FormData>
    //     ({
    //         formName: location.state?.formName,
    //         formStatus: location.state?.status,
    //         generalBoxData: location.state?.generalData || {},
    //         movementBoxData: location.state?.movementData || {},
    //         digitalBoxData: location.state?.digitalData || {},
    //         officeData: location.state?.officeData || {},
    //         formListData: formListDataD || {},

    //     });


	const save = () => {
		console.log("saving data = ", formDataValues);
		console.log("general data", formDataValues.generalData)
	};

	const formSubmit = () => {
		console.log("Submitting = ", formDataValues);
	}

	// Vérifie si l'utilisateur est sur la page Dashboard
	const isDashboard = location.pathname === '/dashboard';

	// console.log("formNameComplet",formNameComplet);

	return (
		<div className={styles.divContainer}>

			<Navbar expand="lg" className={styles.navbar}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Navbar.Brand className={styles.navBarBrand} as={Link} to="/">
						<img src={hopeImage} alt="Hope" />
					</Navbar.Brand>
					<span 
                        className="mx-3" 
                        style={{ color: isDashboard ? 'darkgray' : 'blue' }}
                    >
                        |
                    </span>
					<Nav.Link 
                        as={Link} 
                        to="/" 
                        className="mx-2" 
                        style={{ color: isDashboard ? 'darkgray' : 'blue' }}
                    >
                        Accueil
                    </Nav.Link>
				</div>

				<div>
					{/* Nom du formulaire*/}
					{formName && (
						<Navbar.Text className="mx-3">
							{formName} 
						</Navbar.Text>
					)}

				</div>

				<div>

					<Navbar.Toggle aria-controls="basic-navbar-nav" />

					<Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
						<Nav className="me-auto">
							{/* Suppression du texte ici */}


						</Nav>
						<div className="d-flex align-items-center">

							<div className={styles.formTabButtons}>
								{/* TODO récupérer donner formulaires */}
								{/* <Button className={classNames(styles.saveButton, (formDataValues.formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')} onClick={save}>Enregistrer</Button>
								<Button className={classNames(styles.submitButton, (formDataValues.formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')} onClick={formSubmit}>Soumettre</Button>
								<Button id="goToDashboard" className={styles.deleteButton} onClick={(e) => redirect("/dashboard", e)}>X</Button> */}
								{/* Affiche les boutons seulement si ce n'est pas la page Dashboard */}
								{!isDashboard && (
									<>
										<Button className={classNames(styles.saveButton)} onClick={save}>Enregistrer</Button>
										<Button className={classNames(styles.submitButton)} onClick={formSubmit}>Soumettre</Button>
									</>
								)}

							</div>

							{/* Affiche le nom d'utilisateur et le bouton logout seulement si ce n'est pas la page Dashboard */}
							{isDashboard && user && (
								<>
									<Navbar.Text className="me-2">
										{user.firstname} {user.lastname}
									</Navbar.Text>
									<Button size="sm" onClick={logout}>Logout</Button>
								</>
							)}



						</div>

					</Navbar.Collapse>
				</div >
			</Navbar >
		</div>

	);
}

export default NavBar;
