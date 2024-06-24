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

const InputPhone = ({namespace, displayLabel = false}: Props) => {
	const names = {
		model: buildName<Phone>(namespace, 'model'),
		numberOfPhones: buildName<Phone>(namespace, 'numberOfPhones'),
	}

    const phoneModelList = ["placeHolder"] // TODO: Find exhaustive list of computers

	return <InlineForm>
		<Form.Group controlId={names.model}>
			{displayLabel ? <Form.Label>Model</Form.Label> : null}
			<CustomSelectField name={names.model} options={phoneModelList}/>
		</Form.Group>
		<Form.Group controlId={names.numberOfPhones}>
			{displayLabel ? <Form.Label>Nombre de téléphone</Form.Label> : null}
			<CustomField name={names.numberOfPhones} type="number"/>
		</Form.Group>
	</InlineForm>;
}

export default InputComputer
