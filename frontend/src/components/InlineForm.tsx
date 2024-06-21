import { ReactNode } from "react";
import { Button, Col, Row } from "react-bootstrap";
import styles from './InlineForm.module.css'

interface Props {
	onRemove?: () => void
	children: ReactNode[] | ReactNode
	withLabels?: boolean | undefined
}

/**
 * Composant pour afficher une série de composants en ligne
 * Un bouton de suppression est affiché si la callback correspondant est renseignée
 *
 * @param onRemove callback pour notifier une action de suppression
 * @param children composants à afficher en ligne
 * @param withLabels indique si les labels sont affichés pour corriger l'alignement
 */
const InlineForm = ({onRemove, children, withLabels}: Props) => (
	<Row>
		{Array.isArray(children)
			? children.map((c, idx) => <Col key={idx}>{c}</Col>)
			: <Col>{children}</Col>}
		{onRemove ? <Col xs={2} sm="auto" className={withLabels ? styles.WithLabels : ''}>
			<Button size="sm"
					variant="icon-danger"
					onClick={onRemove}><i className="bi bi-x-lg"></i></Button>
		</Col> : null}
	</Row>
)

export default InlineForm
