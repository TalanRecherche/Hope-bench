import { useContext } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styles from './FormComponents.module.css';

function NavBar() {
	const { user, logout } = useContext(AuthContext);
	const location = useLocation()
	return (
		<Navbar expand="lg" className="mb-5">
			<Container >
			
				<Navbar.Brand className={styles.navBarBrand} style={{ marginLeft: 170 }} as={Link} to="/">Hope</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						{ location.pathname == "/dashboard" &&
							<Navbar.Text className={styles.navBarText}>Mes formulaires de labelisation</Navbar.Text>
						}
					</Nav>
					<div className="d-flex align-items-center">
						<Navbar.Text className="me-2">
							{user.firstname} {user.lastname}
						</Navbar.Text>
						<Navbar.Text className="ms-2">
							{user? <Button size="sm" onClick={logout}>Logout</Button> : null}
						</Navbar.Text>
					</div>
				</Navbar.Collapse>
				
			</Container>
		</Navbar>
	)
}

export default NavBar
