import { useContext } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function NavBar() {
	const {user, logout} = useContext(AuthContext)
	return (
		<Navbar expand="lg" className="bg-primary mb-5">
			<Container>
				<Navbar.Brand as={Link} to="/">Hope Benchmark</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
						<Nav.Link as={Link} to="/form">Form</Nav.Link>
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
