import { Form } from "react-bootstrap";
import { buildName } from "../../model/form.utils";
import CustomField from "./CustomField";
import CustomSelectField from "./CustomSelectField";
import InlineForm from "../InlineForm";
import {Field, FieldArray, Formik, FormikErrors, useField, FieldHookConfig} from "formik";

interface Props {
	namespace: string
	displayLabel?: boolean
}

const InputComputer = ({namespace, displayLabel = false}: Props) => {
	const names = {
		model: buildName<Computer>(namespace, 'model'),
		numberOfComputers: buildName<Computer>(namespace, 'numberOfComputers'),
	}

    const computerModelList = ["placeHolder"] // TODO: Find exhaustive list of computers

	return <InlineForm>
		<Form.Group controlId={names.model}>
			{displayLabel ? <Form.Label>Model</Form.Label> : null}
			<CustomSelectField name={names.model} options={computerModelList}/>
		</Form.Group>
		<Form.Group controlId={names.numberOfComputers}>
			{displayLabel ? <Form.Label>Nombre de machine</Form.Label> : null}
			<CustomField name={names.numberOfComputers} type="number"/>
		</Form.Group>
	</InlineForm>;
}

export default InputComputer
