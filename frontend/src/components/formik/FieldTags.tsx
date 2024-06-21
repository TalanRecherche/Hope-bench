import { Field } from "formik";
import { FieldAttributes, FieldProps } from "formik/dist/Field";
import { Form } from "react-bootstrap";
import TagsInput from 'react-tagsinput';

interface Props extends FieldAttributes<any> {
	name: string
}

const splitFn = (data: string) => data.split(/[,;\n\r]+/)
                                      .map((s: string) => s.trim())
                                      .filter((s: string) => s !== "")							  

/**
 * Composant de saisi de tags s'intégrant avec Formik
 * Les props en entrées sont les mêmes que ceux du composant Field de Formik
 */
const FieldTags = (props: Props) => (
	<Field {...props}>
		{({field, form, meta}: FieldProps) => {
			const isInvalid = meta.touched && meta.error;
			return <>
				<TagsInput value={field.value || []}
				           addOnPaste={true} pasteSplit={splitFn}
				           className={isInvalid ? 'react-tagsinput is-invalid' : 'react-tagsinput'}
						   inputProps={{
							placeholder: 'Ajouter un tag',
							className: 'react-tagsinput-input'
						  }}
				           onChange={(d: string[]) => {
					           form.setFieldValue(props.name, d, true);
					           form.setFieldTouched(props.name, true);
				           }}/>
				{isInvalid
					? <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
					: null}
			</>;
		}}
	</Field>
)

export default FieldTags
