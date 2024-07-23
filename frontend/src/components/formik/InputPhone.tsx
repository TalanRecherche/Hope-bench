import { Form } from "react-bootstrap";
import { buildName } from "../../model/form.utils";
import CustomField from "./CustomField";
import CustomSelectField from "./CustomSelectField";
import InlineForm from "../InlineForm";
import {Field} from "formik";
import { Phone } from "../../model/models";

interface Props {
	namespace: string
	displayLabel?: boolean
}

const InputPhone = ({namespace, displayLabel = false}: Props) => {
	const names = {
		model: buildName<Phone>(namespace, 'model'),
		number_provided: buildName<Phone>(namespace, 'number_provided'),
		provided_by_talan: buildName<Phone>(namespace, 'provided_by_talan'),
	}

    const phoneModelList = ["placeHolder"] // TODO: Find exhaustive list of computers

	return <InlineForm>
		<Form.Group controlId={names.model}>
			{displayLabel ? <Form.Label>Model</Form.Label> : null}
			<CustomSelectField name={names.model} options={phoneModelList}/>
		</Form.Group>
		<Form.Group controlId={names.number_provided}>
			{displayLabel ? <Form.Label>Nombre de téléphone</Form.Label> : null}
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

export default InputPhone
