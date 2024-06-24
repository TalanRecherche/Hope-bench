import { Form } from "react-bootstrap";
import { buildName } from "../../model/form.utils";
import { Education } from "../../model/models";
import CustomField from "./CustomField";
import InlineForm from "../InlineForm";
import {Field, FieldArray, Formik, FormikErrors, useField, FieldHookConfig} from "formik";

interface Props {
	namespace: string
	displayLabel?: boolean
}

const CustomSelectField: React.FC<CustomSelectFieldProps & FieldHookConfig<string>> = ({ label, options, isRequired, ...props }) => {
const [field, meta] = useField<string>(props);

return (
  <Form.Group controlId={props.name}>
    <Form.Label>
        {label}
        {isRequired && <span style={{ color: 'red' }}> *</span>} {/* Conditionally render asterisk */}
    </Form.Label>
    <Form.Control as="select" {...field} required={isRequired}>
      <option value="">Select an option</option>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Form.Control>
    {meta.touched && meta.error ? (
      <div className="error">{meta.error}</div>
    ) : null}
  </Form.Group>
);
};

const InputTransport = ({namespace, displayLabel = false}: Props) => {
	const names = {
		mode: buildName<Transport>(namespace, 'mode'),
		numberOfJourneys: buildName<Transport>(namespace, 'numberOfJourneys'),
		averageDistance: buildName<Transport>(namespace, 'averageDistance'),
	}

    const modeList = ["metro", "vélo", "TGV", "Avion"] // TODO Find exhaustive list of transport modes

	return <InlineForm>
		<Form.Group controlId={names.mode}>
			{displayLabel ? <Form.Label>Mode</Form.Label> : null}
			<CustomSelectField name={names.mode} options={modeList}/>
		</Form.Group>
		<Form.Group controlId={names.numberOfJourneys}>
			{displayLabel ? <Form.Label>Nombre de voyage par mois</Form.Label> : null}
			<CustomField name={names.numberOfJourneys} type="number"/>
		</Form.Group>
		<Form.Group controlId={names.averageDistance}>
			{displayLabel ? <Form.Label>Distance moyenne par mois</Form.Label> : null}
			<CustomField name={names.averageDistance} type="number"/>
		</Form.Group>
	</InlineForm>;
}

export default InputTransport
