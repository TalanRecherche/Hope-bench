import { Form } from "react-bootstrap";
import { buildName } from "../../model/form.utils";
import CustomField from "./CustomField";
import CustomSelectField from "./CustomSelectField";
import InlineForm from "../InlineForm";
import { Transport } from "../../model/models";

interface Props {
	namespace: string
	displayLabel?: boolean
}

const InputTransport = ({namespace, displayLabel = false}: Props) => {
	const names = {
		transport_mode: buildName<Transport>(namespace, 'transport_mode'),
		average_journeys_per_month: buildName<Transport>(namespace, 'average_journeys_per_month'),
		transport_distance: buildName<Transport>(namespace, 'transport_distance'),
	}

    const modeList = ["metro", "vélo", "TGV", "Avion"] // TODO Find exhaustive list of transport modes

	return <InlineForm>
		<Form.Group controlId={names.transport_mode}>
			{displayLabel ? <Form.Label>Mode</Form.Label> : null}
			<CustomSelectField name={names.transport_mode} options={modeList}/>
		</Form.Group>
		<Form.Group controlId={names.average_journeys_per_month}>
			{displayLabel ? <Form.Label>Nombre de voyage par mois</Form.Label> : null}
			<CustomField name={names.average_journeys_per_month} type="number"/>
		</Form.Group>
		<Form.Group controlId={names.transport_distance}>
			{displayLabel ? <Form.Label>Distance moyenne par mois</Form.Label> : null}
			<CustomField name={names.transport_distance} type="number"/>
		</Form.Group>
	</InlineForm>;
}

export default InputTransport
