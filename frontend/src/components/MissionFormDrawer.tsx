import { Formik, FormikErrors } from "formik";
import { BaseSyntheticEvent, MouseEventHandler, ReactNode, useState } from "react";
import { Button, Form, Offcanvas, Stack } from "react-bootstrap";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { scrollToFirstError } from "../model/form.utils";
import { Mission, missionSchema } from "../model/models";
import InputMission from "./formik/InputMission";

interface Props {
	onSave: (m: Mission) => void
	initialValues?: Mission
	children: (props: RenderProp) => ReactNode
}

interface RenderProp {
	toggleDrawer: () => void
}

const emptyMission: Mission = {
	startDate: '', endDate: '',
	company: '', poste: '', description: '',
	tasks: [], skills: [], comments: [], location: ''
}

/**
 * Formulaire pour saisir une Mission
 * Le formulaire se trouve dans un "panneau glissant" qui apparait par la droite de l'écran
 *
 * @param onSave callback avec la mission valide
 * @param initialValues (optionnel) mission à modifier
 * @param children fonction qui permet de définir le composant qui va émettre l'event d'ouverture du formulaire
 * @constructor
 */
const MissionFormDrawer = ({onSave, initialValues, children}: Props) => {
	const [visible, setVisible] = useState<boolean>(false);

	const handleSave = (mission: Mission) => {
		onSave && onSave(mission);
		setVisible(false)
	}

	const toggleDrawer = () => {
		setVisible(!visible)
	}

	const handleSubmitError = (errors: FormikErrors<Mission>) => (e: BaseSyntheticEvent) => {
		e.preventDefault();
		console.warn(errors);
		scrollToFirstError(errors);
	}

	return (
		<>
			{children({toggleDrawer})}
			<Offcanvas scroll
			           show={visible}
			           placement='end'
			           style={{width: '60rem', maxWidth: '100%'}}
			>
				<Offcanvas.Header>
					{initialValues
						? "Modification de la mission"
						: "Ajout d'une nouvelle mission"}
				</Offcanvas.Header>
				<Offcanvas.Body>
					<Formik<Mission>
						onSubmit={handleSave}
						validationSchema={toFormikValidationSchema(missionSchema)}
						initialValues={initialValues || emptyMission}>
						{({handleSubmit, isValid, errors}) => {
							const submitIfValid = (isValid ? handleSubmit : handleSubmitError(errors)) as MouseEventHandler<HTMLButtonElement>
							return (
								<Form noValidate>
									<InputMission/>
									<Stack direction='horizontal' gap={2} className="mt-4">
										<Button variant="primary" onClick={submitIfValid}>Valider</Button>
										<Button variant="secondary" onClick={toggleDrawer}>Annuler</Button>
									</Stack>
								</Form>
							);
						}}
					</Formik>
				</Offcanvas.Body>
			</Offcanvas>
		</>
	)
}
export default MissionFormDrawer
