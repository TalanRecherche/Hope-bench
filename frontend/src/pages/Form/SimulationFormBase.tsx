import React, { Component }  from 'react';
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import FormNavBar from "./FormNavBar";
//import styles from './SimulationForm.module.css';
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