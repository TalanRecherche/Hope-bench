import { useContext, useEffect, useState } from "react";
import { Badge, Button, Container, Stack, Table } from "react-bootstrap";
import Loader from "../components/Loader";
import TemplateFormDrawer from "../components/TemplateFormDrawer";
import { ApiContext, TemplatesByType } from "../contexts/ApiContext";
import { Template, TemplateForm } from "../model/models";
import styles from './TemplateList.module.css'

function TemplateList() {
	const [templatesByType, setTemplatesByType] = useState<TemplatesByType>()
	const {
		deleteTemplate,
		createTemplate,
		updateTemplate,
		downloadTemplate,
		listTemplatesByType
	} = useContext(ApiContext)

	const loadTemplates = () => listTemplatesByType().then(setTemplatesByType)

	const handleDelete = (template: Template): void => {
		const prompt = `Are you sure you want to delete this Template ?`;
		if (window.confirm(prompt)) {
			deleteTemplate(template.id)
			.then(loadTemplates)
		}
	};
	const handleCreate = (template: TemplateForm) => createTemplate(template).then(loadTemplates);
	const handleUpdate = (template: TemplateForm) => updateTemplate(template).then(loadTemplates);

	useEffect(() => {
		loadTemplates()
	}, [])

	if (!templatesByType) {
		return <Loader/>
	}

	return (
		<Container>
			<h2>Templates</h2>
			<Stack gap={3}>
				<Table striped bordered hover responsive>
					<thead>
					<tr>
						<th/>
						<th>Name</th>
						<th>FileName</th>
						<th/>
					</tr>
					</thead>
					{Object.entries(templatesByType).map(([templateType, templates]: [string, Template[]]) =>
						<tbody key={templateType}>
						{templates.map((t: Template, idx: number) =>
							<tr key={t.id} className="align-middle">
								{idx === 0
									? <td rowSpan={templates.length}
									      className={styles.VerticalCell}>{templateType}</td>
									: null
								}
								<td>{t.active ? <Badge bg="success">Actif</Badge> : null}{t.name}</td>
								<td>{t.fileName}</td>
								<td>
									<Stack direction="horizontal" gap={1}>
										<Button className="btn-sm"
										        onClick={() => downloadTemplate(t)}>Télécharger</Button>
										<Button className="btn-sm btn-secondary"
										        onClick={() => downloadTemplate(t, true)}>Tester</Button>
										<TemplateFormDrawer onSave={t => handleUpdate(t)}
										                    initialValues={t}>
											{({toggleDrawer}) => <Button className="btn-sm btn-warning"
											                             onClick={() => toggleDrawer()}>Modifier</Button>}
										</TemplateFormDrawer>
										<Button className="btn-sm btn-danger"
										        onClick={() => handleDelete(t)}>Supprimer</Button>
									</Stack>
								</td>
							</tr>
						)}
						</tbody>
					)}
				</Table>
				<div>
					<TemplateFormDrawer onSave={t => handleCreate(t)}
					                    initialValues={{name: '', file: '', active: false}}>
						{({toggleDrawer}) => <Button className="btn-sm"
						                             onClick={() => toggleDrawer()}>Ajouter un nouveau
							template</Button>}
					</TemplateFormDrawer>
				</div>
			</Stack>
		</Container>
	)
}

export default TemplateList
