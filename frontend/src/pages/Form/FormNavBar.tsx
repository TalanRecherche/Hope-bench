import { Container, Nav, Navbar } from "react-bootstrap";
//import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import './SimulationForm.module.css';

function FormNavBar() {
	return (
		<Navbar bg="light" data-bs-theme="light">
			<Container>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav variant="underline" className="me-auto" >
						<Nav.Link  className='nav-link' as={Link} to="/form/generalTab">Général</ Nav.Link>
						<Nav.Link className='nav-link' as={Link} to="/form/movementTab" >Déplacement</Nav.Link>
						<Nav.Link as={Link} to="/form/digitalTab">Numérique</Nav.Link>
						<Nav.Link as={Link} to="/form/officeTab">Bureau</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
      <Form >
        <Row>
          <Col xs="auto">
            <Button  style={{ backgroundColor: "#fa6343", borderColor: "#fa6343"}} type="submit">Soumettre</Button>
          </Col>
        </Row>
      </Form>
    </Navbar>
	)
}

export default FormNavBar
