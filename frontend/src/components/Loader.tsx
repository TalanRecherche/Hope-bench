import { Spinner, Stack } from "react-bootstrap";

const Loader = () => <Stack gap={3} className="align-items-center justify-content-center">
	<h2>Chargement en cours...</h2>
	<Spinner animation="border" role="status">
		<span className="visually-hidden">Loading...</span>
	</Spinner>
</Stack>

export default Loader
