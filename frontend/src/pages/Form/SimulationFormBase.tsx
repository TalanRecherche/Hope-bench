import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import FormNavBar from "./FormNavBar";
import './SimulationForm.module.css';


function SimulationForm() {
  return (
    <Container>
      <FormNavBar/>
      <Outlet />
    </Container>
  );
}

export default SimulationForm;