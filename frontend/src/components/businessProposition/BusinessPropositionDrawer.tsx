import React, {PropsWithChildren, ChangeEvent, ReactNode, useContext, useState} from "react";
import { Accordion, AccordionButton, Form, Offcanvas, Stack, Col, Row, Button} from "react-bootstrap";
import {BaseModelWithComments, CVData, Mission, Template, has_no_unresolved_comments} from "../../model/models.ts";
import {useToggle} from "usehooks-ts";
import {AccordionButtonProps} from "react-bootstrap/AccordionButton";
import TemplatePicker from "../TemplatePicker.tsx";
import useTemplatesByType from "../../hooks/useTemplatesByType.hook.ts";
import {ApiContext} from "../../contexts/ApiContext.tsx";
import CommentDrawer from "../CommentDrawer.tsx"; 
// import DragAndDropList from "../droppableTests/StrictModeDroppable.tsx";
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { FaGripVertical } from 'react-icons/fa';
import { StrictModeDroppable } from "../droppableTests/StrictModeDroppable.tsx";
interface Props {
    cv: CVData
    children: (props: RenderProp) => ReactNode
    managerView: boolean
    ownCV: boolean
    author: string
}

interface RenderProp {
    toggleDrawer: () => void
}

const createMissionKey = (mission: Mission) : string => {
    return (displayMissionDates(mission) + mission.description + mission.company + mission.description).split('').reduce((hash, char) => { 
        return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash; 
    }, 0).toString()
}


// display mission dates : only start date if end date is null or empty
const displayMissionDates = (mission: Mission) => {
    if (!mission.endDate) {
        return 'Depuis ' + mission.startDate
    }
    return mission.startDate + ' - ' + mission.endDate
}

const CVDrawer = ({cv, managerView, ownCV, author, children}: Props) => {
    const [visible, toggleDrawer] = useToggle(false)

    const toggleMissions = () => {
        if (allSelected) {
            setSelectedMissionIndexes([])
        } else {
            setSelectedMissionIndexes(items.map((_, index) => index))
        }
    }

    const templatesByType = useTemplatesByType(true)
    const {generateCvCustomized} = useContext(ApiContext)
    // const {updateCv} = useContext(ApiContext)

    const onGenerate = (cv: CVData, template: Template) => {
        let oldMissions = cv.missions
        cv.missions = items.filter((_, index) => selectedMissionIndexes.indexOf(index) > -1)
        generateCvCustomized(cv, template);
        cv.missions = oldMissions
    }


    const [items, setItems] = useState(cv.missions);
    const [activeItems, setActiveItems] = useState(['0'] as string[]);
    const [selectedMissionIndexes, setSelectedMissionIndexes] = useState<number[]>([... Array(items.length).keys()])
    const allSelected = selectedMissionIndexes.length === cv.missions.length

    const toggleMission = (missionIndex: number) => {
        if (selectedMissionIndexes.includes(missionIndex)) {
            setSelectedMissionIndexes(selectedMissionIndexes.filter(i => i !== missionIndex))
        } else {
            setSelectedMissionIndexes([...selectedMissionIndexes, missionIndex])
        }
    }

    const toggleAccordionItem = (index: string) => {
        const updatedActiveItems = [...activeItems];
        const indexInActiveItems = updatedActiveItems.indexOf(index);
        if (indexInActiveItems === -1) {
            // If the item is not in activeItems, add it
            updatedActiveItems.push(index);
        } else {
            // If the item is already in activeItems, remove it
            updatedActiveItems.splice(indexInActiveItems, 1);
        }
        setActiveItems(updatedActiveItems);
    };
    
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const newItems = [...items];
        const [removed] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, removed);

        setItems(newItems);

        let oldPos = source.index
        let newPos = destination.index

        const newActiveItems: number[] = []
        for(var x of activeItems.map(index => +index)){
            if(oldPos == newPos){
                newActiveItems.push(x)
            }
            else if(oldPos < newPos){
                if(x < oldPos){
                    newActiveItems.push(x)
                }else if(x==oldPos){
                    newActiveItems.push(newPos)
                }else if(x > oldPos && x <= newPos){
                    newActiveItems.push(x - 1)
                }else{
                    newActiveItems.push(x)
                }
            }
            else if(newPos < oldPos){
                if(x < newPos){
                    newActiveItems.push(x)
                }else if(x>=newPos && x < oldPos){
                    newActiveItems.push(x + 1)
                }else if(x == oldPos){
                    newActiveItems.push(newPos)
                }else{
                    newActiveItems.push(x)
                }
            }
        }


        const newSelectedItems: number[] = []
        for(var x of selectedMissionIndexes){
            if(oldPos == newPos){
                newSelectedItems.push(x)
            }
            if(oldPos < newPos){
                if(x < oldPos){
                    newSelectedItems.push(x)
                }else if(x==oldPos){
                    newSelectedItems.push(newPos)
                }else if(x > oldPos && x <= newPos){
                    newSelectedItems.push(x - 1)
                }else{
                    newSelectedItems.push(x)
                }
            }
            if(newPos < oldPos){
                if(x < newPos){
                    newSelectedItems.push(x)
                }else if(x>=newPos && x < oldPos){
                    newSelectedItems.push(x + 1)
                }else if(x == oldPos){
                    newSelectedItems.push(newPos)
                }else{
                    newSelectedItems.push(x)
                }
            }
        }

        setActiveItems(newActiveItems.map(index => index.toString()))
        setSelectedMissionIndexes(newSelectedItems)
    };


    return (
        <>
            {children({toggleDrawer})}
            <Offcanvas scroll
                       onHide={()=> toggleDrawer()}
                       show={visible}
                       placement='end'
                       style={{width: '60rem', maxWidth: '100%'}}
            >
                <Offcanvas.Header closeButton>
                    {cv.firstname} {cv.lastname}
                    <div className="flex-grow-1"/>
                    <TemplatePicker templatesByType={templatesByType || {}}
                                    title="Exporter"
                                    onSelect={t => onGenerate(cv, t)}/>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Stack gap={4}>
                        <TitleWithCommentButtonIfAvailable title={cv.poste} commModel={cv.comm_general} managerView={managerView} 
                                hasUnresolvedComment={!has_no_unresolved_comments(cv.comm_general)} cv={cv} ownCV={ownCV} modifyPossible={managerView} author={author}/>
                        <p>{cv.introduction}</p>


                        {cv.skills && cv.skills.length > 0 ? <>
                            <TitleWithCommentButtonIfAvailable title={"Compétences"} commModel={cv.comm_skills} managerView={managerView} 
                                hasUnresolvedComment={!has_no_unresolved_comments(cv.comm_skills)} cv={cv} ownCV={ownCV} modifyPossible={managerView} author={author}/>
                            <dl className="row">
                                {cv.skills.map(({domain, skills}, index) => (<React.Fragment key={index}>
                                    <dt className="col-sm-3">{domain}</dt>
                                    <dd className="col-sm-9">{skills.join(', ')} { "   "}
                                    </dd>
                                </React.Fragment>))}
                            </dl>

                    
                        </> : null}
                        {cv.educations &&  cv.educations.length > 0 ? <>
                            <TitleWithCommentButtonIfAvailable title={"Diplômes"} commModel={cv.comm_educations} managerView={managerView} 
                            hasUnresolvedComment={!has_no_unresolved_comments(cv.comm_educations)} cv={cv} ownCV={ownCV} modifyPossible={managerView} author={author}/>
                            <dl className="row">
                                {cv.educations.map(({name, year}, index) => (<React.Fragment key={index}>
                                    <dt className="col-sm-3">{year}</dt>
                                    <dd className="col-sm-9">{name}</dd>
                                </React.Fragment>))}
                            </dl>
                        </> : null}
                        {cv.certifications  && cv.certifications.length > 0 ? <>
                            <TitleWithCommentButtonIfAvailable title={"Certifications/Formations"} commModel={cv.comm_certifications} managerView={managerView} 
                                hasUnresolvedComment={!has_no_unresolved_comments(cv.comm_certifications)} cv={cv} ownCV={ownCV} modifyPossible={managerView} author={author}/>

                            <dl className="row">
                                {cv.certifications.map(({name, date}, index) => (<React.Fragment key={index}>
                                    <dt className="col-sm-3">{date}</dt>
                                    <dd className="col-sm-9">{name}</dd>
                                </React.Fragment>))}
                            </dl>
                        </> : null}
                        {cv.languages &&  cv.languages.length > 0 ? <>
                            <TitleWithCommentButtonIfAvailable title={"Langues"} commModel={cv.comm_languages} managerView={managerView} 
                                hasUnresolvedComment={!has_no_unresolved_comments(cv.comm_languages)} cv={cv} ownCV={ownCV} modifyPossible={managerView} author={author}/>
                            <dl className="row">
                                {cv.languages.map(({name, level}, index) => (<React.Fragment key={index}>
                                    <dt className="col-sm-3">{name}</dt>
                                    <dd className="col-sm-9">{level}</dd>
                                </React.Fragment>))}
                            </dl>
                        </> : null}
                        {cv.missions && cv.missions.length > 0 ? <>
                            <h3>Missions</h3>
                            <Form.Check checked={allSelected}
                                        onChange={toggleMissions}
                                        label={allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                            />
                            <DragDropContext onDragEnd={onDragEnd}>
                                <StrictModeDroppable droppableId="droppable">
                                    {(provided, _) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            <Accordion activeKey={activeItems.map(index => index)} alwaysOpen>
                                                {items.map((mission, index) => (
                                                    <Draggable key={createMissionKey(mission)} draggableId={createMissionKey(mission)} index={index}>
                                                        {(provided, _) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                            >
                                                                <Accordion.Item eventKey={index.toString()} key={index.toString()} className="accordion-item">
                                                                    <CheckableAccordionHeader onClick={() => toggleAccordionItem(index.toString()) }
                                                                                    checked={selectedMissionIndexes.includes(index)}
                                                                                    onCheck={() => toggleMission(index)}>
                                                                        <div {...provided.dragHandleProps} style={{ cursor: 'grab', marginRight: '10px' }}>
                                                                            <FaGripVertical />
                                                                        </div>
                                                                        {displayMissionDates(mission)} : {mission.company}
                                                                        
                                                                    </CheckableAccordionHeader>
                                                                    <Accordion.Body>
                                                                        <p>{mission.description}</p>
                                                                        {mission.tasks && mission.tasks.length > 0 ? <ul>
                                                                            {mission.tasks.map((task, index2) => <li key={index2}>{task}</li>)}
                                                                        </ul> : null}
                                                                        {mission.skills && mission.skills.length > 0 ? <dl className="row">
                                                                            <dt className="col-sm-3">Compétences</dt>
                                                                            <dd className="col-sm-9">{mission.skills.join(', ')}</dd>
                                                                        </dl> : null}
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </Accordion>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </StrictModeDroppable>
                            </DragDropContext>
                            </>: null}
                    </Stack>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default CVDrawer

interface BtnProps extends AccordionButtonProps {
    checked: boolean
    onCheck: (e: ChangeEvent<HTMLInputElement>) => void
}

export function CheckableAccordionHeader({checked, onCheck, ...rest}: BtnProps) {
    return (
        <div className="accordion-header">
            <Form.Check checked={checked}
                        className="accordion-checkbox"
                        onChange={onCheck}/>
            {/* @ts-ignore */}
            <AccordionButton {...rest}/>
        </div>
    );
} 

interface TitleProps extends PropsWithChildren {
    title: String
    commModel: BaseModelWithComments
    hasUnresolvedComment: boolean
    managerView: boolean
    cv: CVData
    ownCV: boolean
    modifyPossible: boolean
    author: string
}

function TitleWithCommentButtonIfAvailable({title, commModel, hasUnresolvedComment, managerView, cv, ownCV, modifyPossible, author}: TitleProps){
    return (
        <Row>
            <Col><h3>{title}</h3></Col>
            <Col xs={12} sm="auto">
            <Stack gap={2} direction="horizontal" className="flex-wrap">
                    {(managerView || (ownCV && hasUnresolvedComment)) ? <CommentDrawer originalCommentModel={commModel} isOnManagerView={managerView} businessPropositionAnnotation={cv} modifyPossible={modifyPossible} author={author}>
                        {({toggleDrawer}) =>
                                    <Button variant="secondary" size="sm" onClick={toggleDrawer}>Voir tous les commentaires</Button>
                                }
                    </CommentDrawer> : null}
                </Stack>
            </Col>
        </Row>
    )
}
