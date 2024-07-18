import {Card, CardBody, CardHeader, Col, Placeholder, Row} from "react-bootstrap";

const BusinessPropositionLoadingCard = () => <Placeholder as={Card} animation="glow">
    <CardHeader>
        <Row className="justify-content-between">
            <Col xs={6} md={3}>
                <Placeholder xs={12}/>
            </Col>
        </Row>
    </CardHeader>
    <CardBody>
        <Placeholder xs={12}/>
        <Placeholder xs={8}/>
        <Placeholder xs={10}/>
        <Placeholder xs={7}/>
    </CardBody>
</Placeholder>

export default BusinessPropositionLoadingCard