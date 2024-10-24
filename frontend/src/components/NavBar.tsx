import { useContext } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from './FormComponents.module.css';
import hopeImage from '../assets/hope.svg';

function NavBar() {
	const { user, logout } = useContext(AuthContext);
	const location = useLocation();

	return (
		<div className={styles.divContainer}>
			<Container fluid="md">
				<Navbar expand="lg" className="mb-5">
					<Navbar.Brand className={styles.navBarBrand} as={Link} to="/">
						<img src={hopeImage} alt="Hope" />
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
						<Nav className="me-auto">
							{/* Suppression du texte ici */}
						</Nav>
						<div className="d-flex align-items-center">
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
