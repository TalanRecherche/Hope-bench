import { ChangeEvent, useContext } from "react";
import { Spinner } from "react-bootstrap";
import { useBoolean } from "usehooks-ts";
import { ApiContext } from "../contexts/ApiContext";
import { CVData } from "../model/models";

interface Props {
	onSuccess: (cv: CVData) => void
	firstname: string,
	lastname: string,
}

const ImportButton = ({onSuccess, firstname, lastname}: Props) => {
	const {value: importing, setTrue: setImporting, setFalse: setImported} = useBoolean(false)
	const {importCvWithNames} = useContext(ApiContext)

	const handleImport = (e: ChangeEvent<HTMLInputElement>): void => {
		const file = e.target.files?.item(0)
		if (file) {
			e.target.value = ''
			setImporting()
			importCvWithNames(firstname, lastname, file).then((cv: CVData) => onSuccess(cv))
			              .finally(() => setImported())
		}
	}

	return <label htmlFor="upload"
	              className={`btn btn-sm btn-secondary ${importing ? 'disabled cursor-not-allowed' : ''}`}>
		{importing ? <Spinner animation="border" role="status" size="sm">
			<span className="visually-hidden">Loading...</span>
		</Spinner> : null} Importer un CV existant (DOCX ou PDF)
		<input type="file" id="upload" accept=".docx,.pdf" className="d-none" disabled={importing} onChange={handleImport}/>
	</label>
}

export default ImportButton
