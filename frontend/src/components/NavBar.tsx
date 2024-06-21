import { useContext } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function NavBar() {
	const {user, logout} = useContext(AuthContext)
	return (
		<Navbar expand="lg" className="bg-primary mb-5">
			<Container>
				<Navbar.Brand as={Link} to="/">CV Pro AI</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link as={Link} to="/my-cvs">Mes Cvs</Nav.Link>
						{user.roles.includes('manager')
							? <Nav.Link as={Link} to="/cvs">Recherche</Nav.Link>
							: null}
						{user.roles.includes('template_manager')
							? <Nav.Link as={Link} to="/templates">Templates</Nav.Link>
							: null}
						{user.roles.includes('template_manager')
							? <Nav.Link as={Link} to="/templates-doc">Documentation</Nav.Link>
							: null}
					</Nav>
					<Navbar.Text>
						{user.firstname} {user.lastname}
					</Navbar.Text>
					<Navbar.Text>
						{false ? <Button size="sm" onClick={logout}>Logout</Button> : null}
					</Navbar.Text>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default NavBar
