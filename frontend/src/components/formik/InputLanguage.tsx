import { Form } from "react-bootstrap";
import { buildName } from "../../model/form.utils";
import { Language } from "../../model/models";
import CustomField from "./CustomField";
import InlineForm from "../InlineForm";

interface Props {
	namespace: string
	displayLabel?: boolean
}

const InputLanguage = ({namespace, displayLabel = false}: Props) => {
	const names = {
		name: buildName<Language>(namespace, 'name'),
		level: buildName<Language>(namespace, 'level')
	}
	return <InlineForm>
		<Form.Group controlId={names.name}>
			{displayLabel ? <Form.Label>Nom</Form.Label> : null}
			<CustomField name={names.name} required/>
		</Form.Group>
		<Form.Group controlId={names.level}>
			{displayLabel ? <Form.Label>Niveau</Form.Label> : null}
			<CustomField name={names.level} required/>
		</Form.Group>
	</InlineForm>;
}

export default InputLanguage
