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
