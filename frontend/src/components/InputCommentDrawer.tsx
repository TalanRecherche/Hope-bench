import React from "react";
import { ReactNode, useState, useEffect, useRef } from "react";
import { Button, Offcanvas, Stack } from "react-bootstrap";
import { Comment } from "../model/models";
import {notifConfig} from "../contexts/api.ts";
import {Store} from "react-notifications-component";


interface Props {
	children: (props: RenderProp) => ReactNode
    setModified: (b: boolean) => void
    addCommentFunction: (m: Comment) => void
    author: string
}

interface RenderProp {
	toggleDrawer: () => void
}



// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};


/**
 * Formulaire pour saisir une Mission
 * Le formulaire se trouve dans un "panneau glissant" qui apparait par la droite de l'écran
 *
 * @param onSave callback avec la mission valide
 * @param initialValues (optionnel) mission à modifier
 * @param children fonction qui permet de définir le composant qui va émettre l'event d'ouverture du formulaire
 * @constructor
 */
const InputCommentDrawer = ({children, setModified, addCommentFunction, author}: Props) => {
	const [visible, setVisible] = useState<boolean>(false);

	const handleSave = (text: string) => {
        if(text != ""){
            let date = new Date()
            let dtf = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });
            setModified(true)
            addCommentFunction({content: text, date: dtf.format(date).split("/").join("-").replace(",", ""),
                dateSolve: "", active: true, author: author})
            toggleDrawer()
        }else{
            Store.addNotification({
                ...notifConfig,
                dismiss: {
                    duration: 10000
                },
                title: 'Le commentaire ne peut pas être vide',
                type: "danger"
            })
        }
		
	}

	const toggleDrawer = () => {
		setVisible(!visible)
        setValue("")
	}

    const onCancel = () => {
        toggleDrawer()
    }

    const [value, setValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useAutosizeTextArea(textAreaRef.current, value);

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;

        setValue(val);
    };

     

    

	return (
		<>
			{children({toggleDrawer})}
			<Offcanvas scroll
			           show={visible}
			           placement='end'
			           style={{width: '60rem', maxWidth: '100%'}}
			>
				<Offcanvas.Header>
					{"Ajout d'un commentaire"}
				</Offcanvas.Header>
				<Offcanvas.Body>
                    <textarea
                        id="review-text"
                        onChange={handleChange}
                        placeholder="Veuillez entrer ici le commentaire à ajouter"
                        ref={textAreaRef}
                        rows={1}
                        value={value}
                    />
                    
				</Offcanvas.Body>
                <Stack direction='horizontal' gap={2} className="mt-4">
                    <Button variant="primary" onClick={() => handleSave(value)}>Sauvegarder</Button>
					<Button variant="secondary" onClick={() => onCancel()}>Annuler</Button>
				</Stack>
			</Offcanvas>
		</>
	)
}
export default InputCommentDrawer
