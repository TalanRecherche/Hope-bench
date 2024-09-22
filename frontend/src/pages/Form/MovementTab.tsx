import FormBoxMovement from "../../components/formBox/FormBoxMovement";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormMeansTransport from '../../components/FormMeansTransport';
import { InformationSourceTypes } from "../../components/InformationSource";
import { useState } from "react";

function MovementTab() {

    let displayList: {
        id: string,
        name: string,
        checked: boolean,
        order: number
    }[] = [];

    const [x, setX] = useState(displayList);
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

    const handleSourceDataReceive = () => {
        console.log(handleSourceDataReceive);
    };

    return (
        <Row>
            <Col xs={3}>
                <FormMeansTransport onDataSend={handleDataReceive}></FormMeansTransport>
            </Col>
            <Col xs={8} style={{ margin: '20px 0px 0px 0px' }}>
                {x?.filter(c => c.checked).sort((a, b) => a.order - b.order).map((item) => (
                    <FormBoxMovement
                    setValues={handleSourceDataReceive}
                    informationSourceType={InformationSourceTypes.fromDeduction}
                    options={{ name: item.name, type: 'text', id: item.id, placeholder: 'Description' }} />
                ))}                
            </Col>
        </Row>
    );
} export default MovementTab