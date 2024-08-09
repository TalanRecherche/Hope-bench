import { useContext } from 'react';
import { Container } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import  FormTab  from "../components/formik/FormTab";
import FormNavBar from "../components/FormNavBar";


function SimulationForm() {
  return (
    <Container>
      <FormNavBar/>
      <FormTab/>      
    </Container>
  );
}

export default SimulationForm;