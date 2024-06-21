import { Form } from "react-bootstrap";
import { buildName } from "../../model/form.utils";
import { Skill } from "../../model/models";
import CustomField from "./CustomField";
import FieldTags from "./FieldTags";
import InlineForm from "../InlineForm";

interface Props {
	namespace?: string
	displayLabel?: boolean
}

const InputSkillsByDomain = ({namespace, displayLabel}: Props) => {
	const names = {
		domain: buildName<Skill>(namespace, 'domain'),
		skills: buildName<Skill>(namespace, 'skills')
	}
	return (
		<InlineForm withLabels={displayLabel}>
			<Form.Group controlId={names.domain}>
				{displayLabel ? <Form.Label>Domaine</Form.Label> : null}
				<CustomField name={names.domain} required/>
			</Form.Group>
			<Form.Group controlId={names.skills}>
				{displayLabel ? <Form.Label>Compétences</Form.Label> : null}
				<FieldTags name={names.skills}/>
			</Form.Group>
		</InlineForm>
	)
}

export default InputSkillsByDomain
