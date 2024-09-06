import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormDigitalEquipments from '../../components/FormDigitalEquipments';
import FormBoxDigital from '../../components/formBox/FormBoxDigital';

function DigitalTab() {
    return (
        <Row>
            <Col xs={3}>
                <FormDigitalEquipments></FormDigitalEquipments>
            </Col>
            <Col xs={8} style={{ margin: '20px 0px 0px 0px' }}>
                <FormBoxDigital
                    isDefaultInformationSource={false}
                    options={{ controlId: 'laptop', name: 'Ordinateurs portables', type: 'text', id: 'inputLaptop', placeholder: 'Description' }} />
            </Col>
        </Row>
    );
} export default DigitalTab