import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function FormNavBar() {
	return (
		<Navbar expand="lg" className="bg-primary mb-5">
			<Container>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link as={Link} to="/form">Général</Nav.Link>
						<Nav.Link as={Link} to="/form">Déplacement</Nav.Link>
						<Nav.Link as={Link} to="/form">Numérique</Nav.Link>
						<Nav.Link as={Link} to="/form">Bureau</Nav.Link>
					</Nav>					
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default FormNavBar
