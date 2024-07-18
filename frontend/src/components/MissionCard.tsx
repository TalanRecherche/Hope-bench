import {PropsWithChildren, useMemo} from "react";
import {Button, Card, CardBody, CardHeader, Col, Row, Stack} from "react-bootstrap";
import {CVData, Mission} from "../model/models";
import CommentDrawer from "./CommentDrawer";

interface Props {
    mission: Mission
    onEdit?: () => void
    onDelete?: () => void
    cv: CVData
    author: string
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", {year: 'numeric', month: 'numeric'})

/**
 * Composant d'affichage d'une mission sous forme de carte
 * Les actions de 'edit' et 'delete' ne sont affichées que si les callbacks associées sont renseignées
 *
 * @param mission mission à afficher
 * @param onEdit (optionnel) callback qui indique une action de modification
 * @param onDelete (optionnel) callback qui indique une action de suppression
 * @constructor
 */
const MissionCard = ({mission, onEdit, onDelete, children, cv, author}: PropsWithChildren<Props>) => {
    const header = useMemo(() => {
        const start = mission.startDate ? dateFormat.format(new Date(mission.startDate)) : null;
        const end = mission.endDate ? dateFormat.format(new Date(mission.endDate)) : null;
        if (start && end) {
            return `${start} - ${end}`
        }
        if (start) {
            return `Depuis le ${start}`
        }
        return 'Nouvelle mission'
    }, [mission])

    const handleDelete = (): void => {
        const prompt = `Êtes-vous sûr de vouloir supprimer cette mission ?`;
        if (onDelete && window.confirm(prompt)) {
            onDelete()
        }
    };

    return (
        <Card>
            <CardHeader>
                <Row>
                    <Col>
                        {header} - <strong>{mission.company}</strong> - <strong>{mission.poste}</strong>
                    </Col>
                    {onEdit || onDelete || mission.comments.length > 0 ? <Col xs={2} sm="auto">
                        <Stack gap={2} direction="horizontal" className="flex-wrap">
                            {onEdit ? <Button variant="icon-warning" size="sm"
                                              onClick={onEdit}><i className="bi bi-pencil-square"></i></Button> : null}
                            {onDelete ? <Button size="sm"
                                                variant="icon-danger"
                                                onClick={handleDelete}><i className="bi bi-x-lg"></i></Button> : null}
                            {mission.comments.length > 0 ? <CommentDrawer originalCommentModel={mission} isOnManagerView={false} businessPropositionAnnotation={cv} modifyPossible={true} author={author}>
                                                                {({toggleDrawer}) =>
                                                                        <Button variant="secondary" size="sm" onClick={toggleDrawer}>Voir tous les commentaires</Button>
                                                                    }
                                                            </CommentDrawer> : null}
                        </Stack>
                    </Col> : null}
                </Row>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col xs={12} lg={6}>
                        <h5>Description</h5>
                        <p>{mission.description}</p>
                        <p>{mission.location}</p>
                        {mission.skills && mission.skills.length > 0 ? <>
                            <h5>Compétences</h5>
                            <p>{mission.skills.join(', ')}</p>
                        </> : null}
                    </Col>
                    {mission.tasks && mission.tasks.length > 0 ? <Col xs={12} lg={6}>
                        <h5>Tâches</h5>
                        <ul>
                            {mission.tasks.map(
                                (s, idx) => <li key={idx}>{s}</li>
                            )}
                        </ul>
                    </Col> : null}
                </Row>
                {children}
            </CardBody>
        </Card>
    )
}

export default MissionCard
