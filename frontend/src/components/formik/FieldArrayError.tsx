import { Field } from "formik";
import { FieldProps } from "formik/dist/Field";

interface Props {
	name: string
}

const FieldArrayError = ({name}: Props) => (
	<Field name={name}>
		{({meta}: FieldProps) => (
			typeof meta.error === 'string'
				// meta.error can be an object
				// display error on array, not subfields
				// d-block to force display
				? <div className="d-block invalid-feedback">{meta.error}</div>
				: null
		)}
	</Field>
)

export default FieldArrayError
