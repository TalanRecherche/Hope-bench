import { Form } from "react-bootstrap";
import { buildName } from "../../model/form.utils";
import { Certification } from "../../model/models";
import CustomField from "./CustomField";
import InlineForm from "../InlineForm";

interface Props {
	namespace: string
	displayLabel?: boolean
}

const InputCertification = ({namespace, displayLabel = false}: Props) => {
	const names = {
		name: buildName<Certification>(namespace, 'name'),
		date: buildName<Certification>(namespace, 'date'),
	}
	return <InlineForm>
		<Form.Group controlId={names.name}>
			{displayLabel ? <Form.Label>Nom</Form.Label> : null}
			<CustomField name={names.name} required/>
		</Form.Group>
		<Form.Group controlId={names.date}>
			{displayLabel ? <Form.Label>Date</Form.Label> : null}
			<CustomField name={names.date} type="date" required/>
		</Form.Group>
	</InlineForm>;
}

export default InputCertification
