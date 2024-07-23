import { Form } from "react-bootstrap";
import { buildName } from "../../model/form.utils";
import CustomField from "./CustomField";
import CustomSelectField from "./CustomSelectField";
import InlineForm from "../InlineForm";
import {Field} from "formik";
import {Computer} from "../../model/models";

interface Props {
	namespace: string
	displayLabel?: boolean
}

const InputComputer = ({namespace, displayLabel = false}: Props) => {
	const names = {
		model: buildName<Computer>(namespace, 'model'),
		number_provided: buildName<Computer>(namespace, 'number_provided'),
		provided_by_talan: buildName<Computer>(namespace, 'provided_by_talan'),
	}

	const computerModelList = ["placeHolder"] // TODO: Find exhaustive list of computers

	return <InlineForm>
		<Form.Group controlId={names.model}>
			{displayLabel ? <Form.Label>Model</Form.Label> : null}
			<CustomSelectField name={names.model} options={computerModelList}/>
		</Form.Group>
		<Form.Group controlId={names.number_provided}>
			{displayLabel ? <Form.Label>Nombre de machine</Form.Label> : null}
			<CustomField name={names.number_provided} type="number"/>
		</Form.Group>
		<Form.Group controlId={names.provided_by_talan}>
		  {displayLabel ? <Form.Label>Provided by Talan</Form.Label> : null}
		  <div>
			<Field type="checkbox" name={names.provided_by_talan} />
		  </div>
		</Form.Group>
	</InlineForm>;
}

export default InputComputer
