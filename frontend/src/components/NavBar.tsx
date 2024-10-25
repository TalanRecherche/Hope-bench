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

	return (
		<div className={styles.divContainer}>
			<Container fluid="md">
				<Navbar expand="lg" className="mb-1">
					<Navbar.Brand className={styles.navBarBrand} as={Link} to="/">
						<img src={hopeImage} alt="Hope" />
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
						<Nav className="me-auto">
							{/* Suppression du texte ici */}
							
							{/* boutons enregistrer/soumettre? */}
						</Nav>
						<div className="d-flex align-items-center">
							{/* Ajout de formName ici */}
							{formName && (
								<Navbar.Text className="mx-3">
									{formName}
								</Navbar.Text>
							)}
						<div className={styles.formTabButtons}>
								{/* TODO récupérer donner formulaires */}
								{/* <Button className={classNames(styles.saveButton, (formDataValues.formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')} onClick={save}>Enregistrer</Button>
								<Button className={classNames(styles.submitButton, (formDataValues.formStatus == FormStatus.submitted) ? styles.formTabDisabled : '')} onClick={formSubmit}>Soumettre</Button>
								<Button id="goToDashboard" className={styles.deleteButton} onClick={(e) => redirect("/dashboard", e)}>X</Button> */}
								<Button className={classNames(styles.saveButton)}>Enregistrer</Button>
								<Button className={classNames(styles.submitButton)}>Soumettre</Button>
								
							</div>
							
							<Navbar.Text className="me-2">
								{user.firstname} {user.lastname}
							</Navbar.Text>
							{user && (
								<Button size="sm" onClick={logout}>Logout</Button>
							)}
						</div>
					</Navbar.Collapse>
				</Navbar>
			</Container>
		</div>
	);
}

export default NavBar;
