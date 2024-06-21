import { Field } from "formik";
import { FieldProps } from "formik/dist/Field";
import { Form, FormControlProps } from "react-bootstrap";

export interface CustomInputProps extends FormControlProps {
	name: string
	// should be ok, but bug in npm run build....
	required?: boolean
}

/**
 * Composant pour faciliter l'utilisation d'inputs simples s'intégrant avec Formik
 * @param name nom de l'input
 * @param props props à transférer à l'input sous-jacent (toutes les props d'un input classique)
 */
const CustomField = ({name, ...props}: CustomInputProps) => (
	<Field name={name}>
		{({field, meta}: FieldProps) => {
			const isInvalid = meta.touched && !!meta.error
			return <>
				<Form.Control {...field} {...props} isInvalid={isInvalid}/>
				{isInvalid
					? <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
					: null}
			</>;
		}}
	</Field>
);

export default CustomField
