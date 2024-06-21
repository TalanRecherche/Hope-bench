import * as React from "react";
import { ReactNode } from "react";
import { Badge, Card, Col, Container, Row, Table } from "react-bootstrap";
import styles from './TemplateDoc.module.css'

interface Definition {
	title: string,
	keyword: string,
	description?: ReactNode
	children?: Definition[]
}

const TypeNumber = () => <Badge bg="info">Nombre</Badge>
const TypeText = () => <Badge bg="secondary">Texte</Badge>
const TypeList = () => <Badge bg="success">Liste</Badge>

const buildDef = (title: string, keyword: string, description?: ReactNode, children?: Definition[]): Definition => ({
	title,
	keyword,
	description,
	children
})

const keywords: Definition[] = [
	buildDef('Prénom', 'firstname', <TypeText/>),
	buildDef('Nom', 'lastname', <TypeText/>),
	buildDef('Trigramme', 'trigram', <>
		<TypeText/> au format "Première lettre du prénom + 2 premières lettres du nom", en majuscule</>),
	buildDef('Poste', 'poste', <TypeText/>),
	buildDef('Introduction', 'introduction', <TypeText/>),
	buildDef('Compétences par domaine', 'skills_by_domain', <TypeList/>,
		[
			buildDef('Domaine', 'domain', <TypeText/>),
			buildDef('Compétences', 'skills', <><TypeList/> de <TypeText/></>)
		]),
	buildDef('Formations', 'educations', <TypeList/>,
		[
			buildDef('Nom', 'name', <TypeText/>),
			buildDef('Année', 'year', <TypeNumber/>)
		]),
	buildDef('Languages', 'languages', <TypeList/>,
		[
			buildDef('Nom', 'name', <TypeText/>),
			buildDef('Niveau', 'level', <TypeText/>),
		]),
	buildDef('Certifications', 'certifications', <TypeList/>,
		[
			buildDef('Nom', 'name', <TypeText/>),
			buildDef('Date', 'date', <><TypeText/> au format "jour-mois-année" (ex: 01-01-2023)</>),
			buildDef('Année', 'year', <TypeNumber/>),
		]),
	buildDef('Missions', 'missions', <TypeList/>,
		[
			buildDef('Date de début', 'startDate', <><TypeText/> au format "jour-mois-année" (ex: 01-01-2023)</>),
			buildDef('Date de fin', 'endDate', <><TypeText/> au format "jour-mois-année" (ex: 01-01-2023)</>),
			buildDef('Dates', 'dates', <>
				<code>startDate</code> si <code>endDate</code> n'est pas défini, sinon <code>startDate - endDate</code>
			</>),
			buildDef('Client', 'company', <TypeText/>),
			buildDef('Poste', 'poste', <TypeText/>),
			buildDef('Description', 'description', <TypeText/>),
			buildDef('Tâches', 'tasks', <><TypeList/> de <TypeText/></>),
			buildDef('Compétences', 'skills', <><TypeList/> de <TypeText/></>),
		]),
]

function TemplateDoc() {
	return (
		<Container>
			<h2>Moteur de Templating</h2>
			<p>Le template fonctionne sur la base de <code>tag</code> et de boucle de <code>tag</code> pour afficher
				l'ensemble des informations basées sur le CV.</p>
			<p>Il existe plusieurs types de <code>tag</code>: </p>
			<ul>
				<li><TypeText/>, <TypeNumber/>
					<ul>
						<li>Ces tags permettent d'afficher du contenu dans le template avec la
							notation <code>{'{{ nom_du_tag }}'}</code></li>
						<li>Exemple pour afficher le prénom : <code>{'{{ firstname }}'}</code></li>
						<li>L'implémentation technique utilise jinja2 en python, il est possible d'utiliser des
							fonctions natives dans le template (fonction <code>upper()</code> sur un <TypeText/> pour
							l'afficher en majuscule). Voir avec un développeur pour plus de détails
						</li>
					</ul>
				</li>
				<li><TypeList/>
					<ul>
						<li>Ce tag permet d'afficher une liste d'éléments dans le template avec la
							notation <code>{'{% for element in nom_du_tag_de_liste %} ... {% endfor %}'}</code></li>
						<li>En remplaçant les <code>...</code> par n'importe quel contenu, tag, mise en page, il est
							possible de répéter un bloc pour chaque élément de la liste
						</li>
						<li>Exemple : <br/><code>
							{'{% for m in missions %}'}
							<div className={styles.ForLoopBody}>
								{'{{m.dates}} : {{m.company}}'}
								<br/>{'{{m.poste}}'}
							</div>
							{'{% endfor %}'}
						</code></li>
					</ul>
				</li>
			</ul>
			<h3>Tips</h3>
			<ul>
				<li>Si vous souhaitez afficher une <TypeList/> de <TypeText/> avec un séparateur il faut utiliser la
					notation
					spéciale suivante : <br/><code>{'{{ \', \'.join(skills.skillsList) }}'}</code></li>
				<li>Si vous avez des espaces entre les éléments d'une <TypeList/> (souvent dans les listes à point), il faut utiliser la notation de
					boucle suivante : <br/>
					<code>
						{'{%- for e in educations.educations %}'}
						<ul className={styles.ForLoopBody}>
							<li>{'{{e.year}} : {{e.name}}'}</li>
						</ul>
						{'{%- endfor %}'}
					</code>
					<ul>
						<li>notez le signe '-' avant le 'for' et avant le 'endfor'</li>
						<li>Vous ne devriez plus avoir d'espace entre les différents éléments de la liste</li>
					</ul>
				</li>
				<li>Si vous souhaitez afficher une <TypeList/> dans un tableau, il faut utiliser la notation de boucle
					suivante : <br/>
					<code>
						<table className="table-bordered">
							<tbody>
							<tr>
								<td colSpan={2}>{'{%tr for l in languages.languages %}'}</td>
							</tr>
							<tr>
								<td>{'{{ l.name }}'}</td>
								<td>{'{{ l.level }}'}</td>
							</tr>
							<tr>
								<td colSpan={2}>{'{%tr endfor %}'}</td>
							</tr>
							</tbody>
						</table>
					</code>
					<ul>
						<li>notez la notation 'tr' avant le 'for' et avant le 'endfor'</li>
						<li>Les lignes contenant les notations de boucle seront supprimées à la génération</li>
					</ul>
				</li>
			</ul>
			<h2>Tags disponibles</h2>
			<TagTable/>
			<h2>Exemple</h2>
			<Row>
				<Col><CVTemplate/></Col>
				<Col><CVExemple/></Col>
			</Row>
		</Container>
	)
}

const TagTable = () => <Table bordered hover responsive>
	<thead>
	<tr>
		<th colSpan={2}>Titre</th>
		<th>Notation</th>
		<th>Description</th>
	</tr>
	</thead>
	<tbody>
	{keywords.map((def: Definition, idx: number) =>
		<React.Fragment key={idx}>
			<tr className={def.children?.length ? styles.DefinitionRow : ''}>
				<td colSpan={2}>{def.title}</td>
				<td><code>{def.keyword}</code></td>
				<td>{def.description}</td>
			</tr>
			{def.children?.map((subDef: Definition, subIdx: number) =>
				<tr key={`${idx}-${subIdx}`}>
					<td/>
					<td>{subDef.title}</td>
					<td><code>{subDef.keyword}</code></td>
					<td>{subDef.description}</td>
				</tr>
			)}
		</React.Fragment>
	)}
	</tbody>
</Table>

const CVTemplate = () => <Card>
	<Card.Header as="h5">Template</Card.Header>
	<Card.Body>
		<h2>{'{{firstname}} {{lastname.upper()}} ({{trigram}})'}</h2>
		<h3>{'{{poste}}'}</h3>
		<p>{'{{introduction}}'}</p>
		<Row>
			<Col>
				<h5 className={styles.MissionListing}>Formations</h5>
				{'{%- for x in educations.educations %}'}
				<ul className={styles.ForLoopBody}>
					<li>{'{{x.year}} - {{x.name}}'}</li>
				</ul>
				{'{%- endfor %}'}
				<h5 className={styles.MissionListing}>Certifications</h5>
				{'{%- for x in certifications.certifications %}'}
				<ul className={styles.ForLoopBody}>
					<li>{'{{x.year}}: {{x.name}}'}</li>
				</ul>
				{'{%- endfor %}'}
				<h5 className={styles.MissionListing}>Langues</h5>
				{'{%- for x in languages.languages %}'}
				<ul className={styles.ForLoopBody}>
					<li>{'{{x.name}} - {{x.level}}'}</li>
				</ul>
				{'{%- endfor %}'}
			</Col>
			<Col>
				{'{% for x in skills_by_domain.skillsList %}'}
				<div className={styles.ForLoopBody}>
					<h5 className={styles.MissionListing}>{'{{x.domain}}'}</h5>
					{'{%- for s in x.skills %}'}
					<ul className={styles.ForLoopBody}>
						<li>{'{{s}}'}</li>
					</ul>
					{'{%- endfor %}'}
				</div>
				{'{% endfor %}'}
			</Col>
		</Row>
		<hr/>
		{'{% for x in missions %}'}
		<div className={styles.ForLoopBody}>
			<h5>{'{{x.dates}}: {{x.company}}'}</h5>
			<strong>{'{{x.poste}}'}</strong>
			<br/>{'{{x.description}}'}
			<h6 className={styles.MissionListing}>Tâches</h6>
			{'{%- for t in x.tasks %}'}
			<ul className={styles.ForLoopBody}>
				<li>{'{{t}}'}</li>
			</ul>
			{'{%- endfor %}'}
			<h6 className={styles.MissionListing}>Compétences</h6>
			{'{{ ", ".join(x.skills) }}'}
		</div>
		<hr/>
		{'{% endfor %}'}

	</Card.Body></Card>

const CVExemple = () => <Card>
	<Card.Header as="h5">Résultat</Card.Header>
	<Card.Body>
		<h2>Jane DOE (JDE)</h2>
		<h3>Lead Développeuse</h3>
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
			magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
			commodo
			consequat.</p>
		<Row>
			<Col>
				<h5 className={styles.MissionListing}>Formations</h5>
				<ul>
					<li>2015 - École Ingénieur ABC</li>
				</ul>
				<h5 className={styles.MissionListing}>Certifications</h5>
				<ul>
					<li>2020 - Angular</li>
					<li>2022 - Azure Fondamentals</li>
				</ul>
				<h5 className={styles.MissionListing}>Langues</h5>
				<ul>
					<li>Anglais - C1 (TOEIC 950)</li>
				</ul>
			</Col>
			<Col>
				<h5 className={styles.MissionListing}>Technos</h5>
				<ul>
					<li>Java</li>
					<li>Typescript</li>
					<li>HTML</li>
					<li>CSS</li>
				</ul>
				<h5 className={styles.MissionListing}>Infra</h5>
				<ul>
					<li>Azure</li>
					<li>AWS</li>
				</ul>
			</Col>
		</Row>
		<hr/>
		<div className={styles.MissionBody}>
			<h5>08-2020: Entreprise 1</h5>
			<strong>Développeur FullStack</strong>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
				eiusmod tempor incididunt ut labore
				et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
				aliquip ex ea commodo consequat.</p>
			<h6 className={styles.MissionListing}>Tâches</h6>
			<ul>
				<li>Tester</li>
				<li>Valider</li>
				<li>Livrer</li>
			</ul>
			<h6 className={styles.MissionListing}>Compétences</h6>
			Node, Express, Cypress
		</div>
		<hr/>
		<div className={styles.MissionBody}>
			<h5>01-2019 - 08-2020: Entreprise 2</h5>
			<strong>Développeur FullStack</strong>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
				eiusmod tempor incididunt ut labore
				et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
				aliquip ex ea commodo consequat.</p>
			<h6 className={styles.MissionListing}>Tâches</h6>
			<ul>
				<li>Tester</li>
				<li>Valider</li>
				<li>Livrer</li>
			</ul>
			<h6 className={styles.MissionListing}>Compétences</h6>
			Node, Express, Cypress
		</div>
		<hr/>
	</Card.Body></Card>

export default TemplateDoc
