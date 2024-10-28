import { useContext } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from './FormComponents.module.scss';
import hopeImage from '../assets/hope.svg';
import classNames from 'classnames';

function NavBar() {
	const { user, logout } = useContext(AuthContext);
	const location = useLocation();
	const { formName } = location.state || {};
	const formDataValues = location.state || {};

	console.log(formDataValues);

	const save = () => {
		console.log("saving data = ", formDataValues);
		console.log("general data", formDataValues.generalData)
	};

	const formSubmit = () => {
		console.log("Submitting = ", formDataValues);
	}

	// Vérifie si l'utilisateur est sur la page Dashboard
	const isDashboard = location.pathname === '/dashboard';

	return (
		<div className={styles.divContainer}>
			<Container fluid="md">
				<Navbar expand="lg" className="mb-1 ">
					<Navbar.Brand className={styles.navBarBrand} as={Link} to="/">
						<img src={hopeImage} alt="Hope" />
					</Navbar.Brand>
					<span className="mx-3" style={{ color: 'gray' }}>|</span> {/* Séparateur gris */}
					<Nav.Link as={Link} to="/" className="mx-2" style={{ color: 'blue' }}>Accueil</Nav.Link> {/* Lien Accueil en bleu */}
				
				
					<Navbar.Toggle aria-controls="basic-navbar-nav" />


					{/* Nom du formulaire*/}
					{formName && (
						<Navbar.Text className="mx-3">
							{formName}
						</Navbar.Text>
					)}

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
				</Navbar>
			</Container>
		</div>
	);
}

export default NavBar;
