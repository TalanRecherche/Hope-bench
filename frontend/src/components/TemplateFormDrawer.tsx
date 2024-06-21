import { Formik, FormikErrors } from "formik";
import { MouseEventHandler, ReactNode, SyntheticEvent, useState } from "react";
import { Button, Form, Offcanvas, Stack } from "react-bootstrap";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { scrollToFirstError } from "../model/form.utils";
import { TemplateForm, templateFormSchema } from "../model/models";
import InputTemplate from "./formik/InputTemplate";

interface Props {
	onSave: (t: TemplateForm) => void
	initialValues: TemplateForm
	children: (props: RenderProp) => ReactNode
}

interface RenderProp {
	toggleDrawer: () => void
}

/**
 * Formulaire pour saisir un Template
 * Le formulaire se trouve dans un "panneau glissant" qui apparait par la droite de l'écran
 *
 * @param onSave callback avec le template valide
 * @param initialValues (optionnel) template à modifier
 * @param children fonction qui permet de définir le composant qui va émettre l'event d'ouverture du formulaire
 * @constructor
 */
const TemplateFormDrawer = ({onSave, initialValues, children}: Props) => {
	const [visible, setVisible] = useState<boolean>(false);

	const handleSave = (template: TemplateForm) => {
		onSave && onSave(template);
		setVisible(false)
	}

	const toggleDrawer = () => {
		setVisible(!visible)
	}

	const handleSubmitError = (errors: FormikErrors<TemplateForm>) => (e: SyntheticEvent) => {
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
			           style={{width: '40rem', maxWidth: '100%'}}
			>
				<Offcanvas.Header>
					{initialValues.id
						? "Modification de la template"
						: "Ajout d'une nouvelle template"}
				</Offcanvas.Header>
				<Offcanvas.Body>
					<Formik<TemplateForm>
						onSubmit={handleSave}
						validationSchema={toFormikValidationSchema(templateFormSchema)}
						initialValues={initialValues}>
						{({handleSubmit, isValid, errors}) => {
							const submitIfValid = (isValid ? handleSubmit : handleSubmitError(errors)) as MouseEventHandler<HTMLButtonElement>
							return (
								<Form noValidate>
									<InputTemplate/>
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
export default TemplateFormDrawer
