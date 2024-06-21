import { Form, Stack } from "react-bootstrap";
import { buildName } from "../../model/form.utils";
import { TemplateForm } from "../../model/models";
import CustomField from "./CustomField";
import CustomFieldCheck from "./CustomFieldCheck";
import CustomFieldFile from "./CustomFieldFile";

interface Props {
	namespace?: string
}

const InputTemplate = <T extends TemplateForm>({namespace}: Props) => {
	const names = {
		name: buildName<T>(namespace, "name"),
		active: buildName<T>(namespace, "active"),
		file: buildName<T>(namespace, "file")
	}
	return (
		<Stack gap={4}>
			<Form.Group controlId={names.name}>
				<Form.Label>Nom</Form.Label>
				<CustomField name={names.name} required/>
			</Form.Group>
			<Form.Group controlId={names.active}>
				<Form.Label>Actif</Form.Label>
				<CustomFieldCheck name={names.active} type="switch" required/>
			</Form.Group>
			<Form.Group controlId={names.file}>
				<Form.Label>Fichier</Form.Label>
				<CustomFieldFile name={names.file} accept=".docx,.pptx" required/>
			</Form.Group>
		</Stack>
	);
}

export default InputTemplate
