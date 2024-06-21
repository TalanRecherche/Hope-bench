import { Form } from "react-bootstrap";
import { buildName } from "../../model/form.utils";
import { Education } from "../../model/models";
import CustomField from "./CustomField";
import InlineForm from "../InlineForm";

interface Props {
	namespace: string
	displayLabel?: boolean
}

const InputEducation = ({namespace, displayLabel = false}: Props) => {
	const names = {
		name: buildName<Education>(namespace, 'name'),
		year: buildName<Education>(namespace, 'year')
	}
	return <InlineForm>
		<Form.Group controlId={names.name}>
			{displayLabel ? <Form.Label>Nom</Form.Label> : null}
			<CustomField name={names.name} required/>
		</Form.Group>
		<Form.Group controlId={names.year}>
			{displayLabel ? <Form.Label>Année d'obtention</Form.Label> : null}
			<CustomField name={names.year} type="number" required/>
		</Form.Group>
	</InlineForm>;
}

export default InputEducation
