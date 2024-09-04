import FormBoxMovement from "../../components/formBox/FormBoxMovement";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormMeansTransport from '../../components/FormMeansTransport';

function MovementTab() {
    return (
        <Row>
            <Col xs={3}>
                <FormMeansTransport></FormMeansTransport>
            </Col>
            <Col xs={8} style={{ margin: '20px 0px 0px 0px' }}>
                <FormBoxMovement
                    isDefaultInformationSource={false}
                    options={{ controlId: 'plane', name: 'Avion', type: 'text', id: 'inputPlane', placeholder: 'Description' }} />

                <FormBoxMovement
                    options={{ controlId: 'electricCar', name: 'Voiture électrique', type: 'text', id: 'inputElectricCar', placeholder: 'Description' }} />

                <FormBoxMovement
                    options={{ controlId: 'publicTransport', name: 'RER ou transilien', type: 'text', id: 'inputPublicTransport', placeholder: 'Description' }} />

            </Col>
        </Row>
    );
} export default MovementTab