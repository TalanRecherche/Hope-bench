import {useContext} from "react";
import {Button, Card, CardBody, CardHeader, Col, Form, Row, Stack} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {CVData} from "../../model/models.ts";
import {isCvValid} from "../../model/cvFunctions.tsx";
import Tooltip from "../Tooltip.tsx";
import {ApiContext} from "../../contexts/ApiContext.tsx";
import {Store} from "react-notifications-component";
import {notifConfig} from "../../contexts/api.ts";

interface Props {
    cv: CVData,
    editable?: boolean,
    canReview?: boolean,
    onSelect?: (c: CVData) => void,
    selected?: boolean,
    onView?: (c: CVData) => void,
    onDelete?: (c: CVData) => void,
    // onGenerate?: (c: CVData, t: Template) => void
    onDuplicate?: (c: CVData) => void,
    // onDefineAsMainCv?: (c: CVData) => void,
}




const CvCard = ({cv, onView, editable, canReview, onSelect, selected, onDelete, onDuplicate}: Props) => {
    const {updateStatusCV} = useContext(ApiContext)

    const navigate = useNavigate()

    // Verify is cv.status is changed when the DB is changed.
    const onSendToManager = (cv: CVData) => {
        if(cv.status <= 1 && isCvValid(cv) ){
            updateStatusCV(cv, 2).then(() => {
                // Navigate to the current page to refresh the list of CVs
                navigate(0); // This effectively refreshes the current page
            });
            cv.status = 2
        }else{
            if(cv.status == 1){
                Store.addNotification({
                    ...notifConfig,
                    dismiss: {
                        duration: 10000
                    },
                    title: 'Ce CV contient encore des commentaires non résolus et ne peut donc pas être validé.',
                    type: "danger"
                }) 
            }else{
                if(cv.status == 3){
                    Store.addNotification({
                        ...notifConfig,
                        dismiss: {
                            duration: 10000
                        },
                        title: 'Ce CV a déjà été marqué comme validé.',
                        type: "danger"
                    }) 
                }else{
                   Store.addNotification({
                        ...notifConfig,
                        dismiss: {
                            duration: 10000
                        },
                        title: 'Ce CV a déjà été envoyé à votre manager.',
                        type: "danger"
                    }) 
                }
            }
        }
    }

    const validateCV = (cv: CVData) => {
        if(cv.status == 2 && isCvValid(cv)){
            updateStatusCV(cv, 3).then(() => {
                // Navigate to the current page to refresh the list of CVs
                navigate(0); // This effectively refreshes the current page
            });
            cv.status = 3
        }else{
            if(cv.status == 0){
                Store.addNotification({
                    ...notifConfig,
                    dismiss: {
                        duration: 10000
                    },
                    title: 'Ce CV est un brouillon, pas encore soumis à correction',
                    type: "danger"
                }) 
            }else{
                if(cv.status == 1){
                    Store.addNotification({
                        ...notifConfig,
                        dismiss: {
                            duration: 10000
                        },
                        title: 'Ce CV est en cours de correction par l\'employé.',
                        type: "danger"
                    }) 
                }else{
                    if(cv.status == 3){
                        Store.addNotification({
                                ...notifConfig,
                                dismiss: {
                                    duration: 10000
                                },
                                title: 'Ce CV a déjà été marqué comme validé.',
                                type: "danger"
                            }) 
                    }else{
                        Store.addNotification({
                                ...notifConfig,
                                dismiss: {
                                    duration: 10000
                                },
                                title: 'Ce CV contient encore des commentaires non résolus et ne peut donc pas être validé.',
                                type: "danger"
                            }) 
                    }
                }
            }
        }
    }

    const onSendToEmployee = (cv: CVData) => {
        if(isCvValid(cv)){
            Store.addNotification({
                ...notifConfig,
                dismiss: {
                    duration: 10000
                },
                title: 'Ce CV ne contient aucun commentaire, et ne peut donc pas être renvoyé à l\'employé pour qu\'il effectue des corrections.',
                type: "danger"
            })            
        }else{
            if(cv.status == 3){
                Store.addNotification({
                    ...notifConfig,
                    dismiss: {
                        duration: 10000
                    },
                    title: 'Ce CV a été précedemment validé et ne peut donc pas être renvoyé à l\' employé',
                    type: "danger"
                })
            }else {
                if(cv.status == 1){
                    Store.addNotification({
                        ...notifConfig,
                        dismiss: {
                            duration: 10000
                        },
                        title: 'Ce CV a déjà été envoyé à l\'employé pour qu\'il effectue des corrections',
                        type: "danger"
                    })
                }
                else{
                    if(cv.status == 0){
                        Store.addNotification({
                            ...notifConfig,
                            dismiss: {
                                duration: 10000
                            },
                            title: 'Ce CV est un brouillon, pas encore soumis à correction',
                            type: "danger"
                        })
                    }else{
                        updateStatusCV(cv, 1).then(() => {
                            // Navigate to the current page to refresh the list of CVs
                            navigate(0); // This effectively refreshes the current page
                        });
                        cv.status = 1
                    }
                }
            }
        }
    }

    return (
        <Card>
            <CardHeader className={cv.primary_cv ? 'my-accordion-header': ''}>
                <Row>
                    <Col>
                        {onSelect && <Tooltip title="Export multiples" delay={500}>
                            <Form.Check checked={selected} className="d-inline"
                                        onChange={() => onSelect(cv)}/>
                        </Tooltip>} {cv.firstname} {cv.lastname} - {cv.poste}
                        {cv.label != undefined && cv.label.trim() !== "" && " - "}
                {cv.label != undefined && cv.label.trim() !== "" ? (
                    <span style={{ color: 'green' }}>
                        <strong> {cv.label}</strong>
                    </span>
                ) : (
                    ""
                )}
                {cv.primary_cv ? (
                    <span style={{ color: 'blue' }}>
                        <strong> - CV PRINCIPAL</strong>
                    </span>
                ) : (
                    ""
                )}
            </Col>
                    <Col xs={12} sm="auto">
                        <Stack gap={2} direction="horizontal" className="flex-wrap">
                            {onDelete && <Tooltip title="Supprimer">
                                <Button variant="icon-danger" size="sm"
                                        onClick={() => onDelete(cv)}><i className="bi bi-x-circle-fill"></i></Button>
                            </Tooltip>}
                            {onView && <Tooltip title="Consulter">
                                <Button variant="icon-primary" size="sm"
                                        onClick={() => onView(cv)}><i className="bi bi-eye-fill"></i></Button>
                            </Tooltip>}
                            {editable && <Tooltip title="Modifier">
                                {/* @ts-ignore */}
                                <Button as={Link} variant="icon-primary" size="sm"
                                        to={`/cvs/${cv.id}`}><i className="bi bi-pencil-square"></i></Button>
                            </Tooltip>}
                            {false && editable && <Tooltip title="Envoyer à mon responsable pour évaluation"> 
                                <Button variant="icon-primary" size="sm"
                                        onClick={() => onSendToManager(cv)}><i className="bi bi-send"></i></Button>
                            </Tooltip>}
                            {false && canReview && <Tooltip title="Envoyer à l'employé pour correction"> 
                                <Button variant="icon-primary" size="sm"
                                        onClick={() => onSendToEmployee(cv)}><i className="bi bi-send"></i></Button>
                            </Tooltip>}
                            {canReview && <Tooltip title="Marquer le CV comme validé"> 
                                <Button variant="icon-primary" size="sm"
                                        onClick={() => validateCV(cv)}><i className="bi bi-check2-circle"></i></Button>
                            </Tooltip>}
                            {onDuplicate && <Tooltip title="Dupliquer">
                                <Button variant="icon-warning" size="sm"
                                        onClick={() => onDuplicate(cv)}>
                                    <i className="bi bi-copy"></i></Button>
                            </Tooltip>}
                            {/* {onDefineAsMainCv && !cv.primary_cv && <Tooltip title="Définir comme CV principal">
                                <Button variant="icon-warning" size="sm"
                                        onClick={() => onDefineAsMainCv(cv)}>
                                    <i className="bi bi-star-fill"></i></Button>
                            </Tooltip>}
                            {onGenerate && <Tooltip title="Exporter">
                                <div>
                                    <TemplatePicker templatesByType={templatesByType || {}}
                                                    onSelect={t => onGenerate(cv, t)}/>
                                </div>
                            </Tooltip>} */}
                            
                        </Stack>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>{cv.introduction}</CardBody>
        </Card>
    )
}

export default CvCard
