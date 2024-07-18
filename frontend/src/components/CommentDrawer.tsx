import { ReactNode, useState, useContext} from "react";
import { Accordion, AccordionButton, Offcanvas, Stack, Button} from "react-bootstrap";
import {AccordionButtonProps} from "react-bootstrap/AccordionButton";
import {Store} from "react-notifications-component";
import { BaseModelWithComments, CVData, Comment } from "../model/models";
import {notifConfig} from "../contexts/api.ts";
import {ApiContext} from "../contexts/ApiContext.tsx";
import InputCommentDrawer from "./InputCommentDrawer.tsx";

interface Props {
	children: (props: RenderProp) => ReactNode
    originalCommentModel: BaseModelWithComments
    isOnManagerView: boolean
    modifyPossible: boolean
    businessPropositionAnnotation: CVData
    author: string
}

interface RenderProp {
	toggleDrawer: () => void
}

/**

 * @constructor
 */
const CommentDrawer = ({children, isOnManagerView, modifyPossible, originalCommentModel, businessPropositionAnnotation: cv, author}: Props) => {
	const [visible, setVisible] = useState<boolean>(false);
    const [modifiedCommentList, setModifiedCommentList] = useState<boolean>(false);
	const [backup, setBackup] = useState<BaseModelWithComments>({comments: []});
    const {updateCv} = useContext(ApiContext)
    const [commentModel, _setCommentModel] = useState<BaseModelWithComments>(originalCommentModel);

    const setCommentModel = (comments: Comment[]) => {
        let newCommModel = {comments : comments}      
        _setCommentModel(newCommModel)
    }
    // const handleSave = (comment: Comment) => {
	// 	onSave && onSave(comment);
	// 	setVisible(false)
	// }

    const makeBackupOfCommentList = (commentModel: BaseModelWithComments) => {
        let backupTmp = {comments: []} as BaseModelWithComments
        for(var c of commentModel.comments){
            backupTmp.comments.push({date: c.date, active: c.active, dateSolve: c.dateSolve, content: c.content, author: c.author})
        }
        return backupTmp
    }

	const toggleDrawer = () => {
        if(!visible){
            setBackup(makeBackupOfCommentList(commentModel))
            setModifiedCommentList(false)
        }
		setVisible(!visible)
	}

    const onCloseButtonPressed = (saveNeeded: boolean) =>{
        if(saveNeeded && modifiedCommentList){
            Store.addNotification({
                ...notifConfig,
                dismiss: {
                    duration: 10000
                },
                title: 'Vous ne pouvez pas fermer cet onglet sans sauvegarder ou annuler les modifications effectuées.',
                type: "danger"
            })
        }else{
            if(modifiedCommentList){
                originalCommentModel.comments = commentModel.comments
            }
            toggleDrawer()
        }
        
    }

    const onResolveClick = (c: Comment) =>{
        c.active = false
        let date = new Date()
        let dtf = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });
        c.dateSolve = dtf.format(date).split("/").join("-").replace(",", "")
        setModifiedCommentList(!modifiedCommentList)
        setModifiedCommentList(!modifiedCommentList)
    }

    const onCancel = () =>{
        if(modifiedCommentList){
            originalCommentModel.comments = []
            for(var c of backup.comments){
                originalCommentModel.comments.push({date: c.date, active: c.active, dateSolve: c.dateSolve, content: c.content, author: c.author})
            }
        }
        setVisible(!visible)
    }

    const onSave = (dbSaveNeeded: boolean, cv: CVData) =>{
        originalCommentModel.comments = commentModel.comments
        if(modifiedCommentList && dbSaveNeeded){ 
            updateCv(cv)
        }
        setVisible(!visible)
    }

    function addComment(newComment: Comment) {
        // Suppose que vous avez déjà une liste de commentaires existante
        setCommentModel([...commentModel.comments, newComment]);
    }

	// const handleSubmitError = (errors: FormikErrors<Mission>) => (e: BaseSyntheticEvent) => {
	// 	e.preventDefault();
	// 	console.warn(errors);
	// 	scrollToFirstError(errors);
	// }

	return (
		<>
			{children({toggleDrawer})}
			<Offcanvas scroll
                       onHide={() => onCloseButtonPressed(modifyPossible && isOnManagerView)}
			           show={visible}
			           placement='end'
			           style={{width: '60rem', maxWidth: '100%'}}
			>
				<Offcanvas.Header closeButton>
					{"Consultation des commentaires"}
				</Offcanvas.Header>
				<Offcanvas.Body>
                {(commentModel != null && commentModel.comments != null && commentModel.comments.length > 0) ? 
                        (modifiedCommentList || !modifiedCommentList || commentModel || !commentModel) ? 
                            <>
                                <h3>Commentaires</h3>
                                <Accordion defaultActiveKey={['0']} alwaysOpen style={{marginTop:30}} >
                                    {commentModel.comments.map((comment: Comment, index: number) =>
                                        <Accordion.Item eventKey={index + ''} key={index} style={{ marginBottom: '1px', border: '1px solid #ccc' }}>
                                            <AccordionHeader style={{display: 'flex', alignItems: 'center'}} className={comment.active ? '':'my-accordion-body'}>
                                                <div className="col-6 text-truncate">
                                                     {comment.date} - {comment.author} - {comment.content}
                                                </div>
                                            </AccordionHeader>
                                            <Accordion.Body className={comment.active ? '':'my-accordion-body'}>
                                                {/* <h4>{comment.date}</h4> */}
                                                <p>{comment.content}</p>
                                                {comment.active ? <ul>
                                                    {modifyPossible && !isOnManagerView ? <Button onClick={() => onResolveClick(comment)}>Marquer comme résolu</Button> : null}
                                                </ul> : "Résolu : " + comment.dateSolve}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )}
                                </Accordion>
                            </> : null 
                        : null}
                        <Stack direction='horizontal' gap={2} className="mt-4">
										{isOnManagerView && modifyPossible ? <InputCommentDrawer setModified={setModifiedCommentList} addCommentFunction={addComment} author={author}>
                                                {({toggleDrawer}) =>
                                                            <Button variant="secondary" size="sm" onClick={toggleDrawer}>Ajouter un commentaire</Button>
                                                        }
                                                </InputCommentDrawer>
                                        : null}
                                        {isOnManagerView && modifyPossible ? <Button variant="primary" onClick={() => onSave(isOnManagerView, cv)}>Sauvegarder les modifications</Button> : null}

                                        {isOnManagerView && modifyPossible  ? <Button variant="secondary" onClick={() => onCancel()}>Annuler</Button> : null}
									</Stack>
				</Offcanvas.Body>
			</Offcanvas>
            
		</>
	)
}
export default CommentDrawer

function AccordionHeader({...rest}: AccordionButtonProps) {
    return (
        <div className="accordion-header">
            {/* @ts-ignore */}
            <AccordionButton {...rest}/>
        </div>
    );
}