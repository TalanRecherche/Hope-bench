import { Field } from "formik";
import { FieldProps } from "formik/dist/Field";
import { Form, FormControlProps } from "react-bootstrap";

interface Props extends FormControlProps {
	name: string
	// should be ok, but bug in npm run build....
	required?: boolean
	accept?: string
}

/**
 * Composant pour faciliter l'utilisation d'inputs simples s'intégrant avec Formik
 * @param name nom de l'input
 * @param props props à transférer à l'input sous-jacent (toutes les props d'un input classique)
 */
const CustomFieldFile = ({name, ...props}: Props) => (
	<Field name={name}>
		{({field: {value, ...rest}, form, meta}: FieldProps) => {
			const isInvalid = meta.touched && !!meta.error;
			return <>
				<Form.Control {...rest} {...props}
				              isInvalid={isInvalid}
				              type="file"
				              onChange={e => {
								  // @ts-ignore
					              form.setFieldValue(name, e.target.files[0], true);
					              form.setFieldTouched(name, true)
				              }}/>
				{isInvalid
					? <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
					: null}
			</>;
		}}
	</Field>
);

export default CustomFieldFile
