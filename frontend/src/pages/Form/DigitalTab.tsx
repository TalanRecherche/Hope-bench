import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormDigitalEquipments from '../../components/FormDigitalEquipments';
import FormBoxDigital from '../../components/formBox/FormBoxDigital';
import { InformationSourceTypes } from '../../components/InformationSource';
import { useState } from 'react';

function DigitalTab() {
    let initialList: {
        id: string,
        name: string,
        checked: boolean,
        order: number
    }[] = [];

    const [x, setX] = useState(initialList);
    const handleDataReceive = (data: any) => {

        setX(x => {
            if (data[0].checked) {
                x = x.concat(data);
            }
            else {
                let value = x.find(l => l.id == data[0].id);

                if (value) {
                    var index = x.indexOf(value);
                    if (index !== -1) {
                        x = x.splice(index, 1);
                    }
                }
            }
            return x;
        });
    };

    return (
        <Row>
            <Col xs={3}>
                <FormDigitalEquipments onDataSend={handleDataReceive}></FormDigitalEquipments>
            </Col>
            <Col xs={8} style={{ margin: '20px 0px 0px 0px' }}>
                {x?.filter(c => c.checked).sort((a, b) => a.order - b.order).map((item) => (
                    <FormBoxDigital
                        informationSourceType={InformationSourceTypes.fromDeduction}
                        options={{ name: item.name, type: 'text', id: item.id, placeholder: 'Description' }} />
                ))}
            </Col>
        </Row>
    );
} export default DigitalTab