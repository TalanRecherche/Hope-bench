import { Form, Card, Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import DigitalItemDropbox from './genericCustom/DigitalItemDropbox';
import CustomTable from './genericCustom/CustomTable';
import styles from './FormComponents.module.scss';
import { BoxItemType } from '../model/simulationDataModel';
import classNames from 'classnames';
import { useState } from 'react';

interface EmailFormCardProps {
  options: any;
  itemlist: BoxItemType[];
  selectedItem: { value: string; label: string };
  setSelectedItem: (item: any) => void;
  selectedItemCount: number;
  setCount: (value: any) => void;
  addItem: () => void;
  removeItem: (index: any) => void;
  updateItemCount: (value: number, index: number) => void;
  selectedItemRequired: boolean;
}

const EmailFormCard = ({
  options,
  itemlist,
  selectedItem,
  setSelectedItem,
  selectedItemCount,
  setCount,
  addItem,
  removeItem,
  updateItemCount,
  selectedItemRequired
}: EmailFormCardProps) => {
  // State pour la fréquence, l'unité et la checkbox "L'information n'est pas dans le document"
  const [frequency, setFrequency] = useState<number>(0);
  const [frequencyUnit, setFrequencyUnit] = useState<string>('jours'); // Par défaut en "jours"
  const [infoNotInDocument, setInfoNotInDocument] = useState<boolean>(false);

  // Fonction pour gérer l'événement onChange de NumericInput
  const handleFrequencyChange = (value: number | null, stringValue: string, input: HTMLInputElement) => {
    if (value !== null) {
      setFrequency(value); // Met à jour le state frequency avec la valeur numérique
    }
  };

  return (
    <Card style={{ borderRadius: "4px 4px 0px 0px" }} className={styles.boxItem}>
      <Card.Body>
        <Form.Group>
          <Form.Label className={styles.TextBold}>{options.name}</Form.Label>                       
          
          {/* Fréquence d'envoi email */}
          <div className={styles.frequencySection}>
            <Form.Label className={classNames(styles.boxDigitalHeadTitle, styles.titleCard)}>Fréquence d'envoi email</Form.Label>
            
            {/* Si aucune information n'est présente, afficher un texte avec une supposition */}
            {!options.information && (
               <p className={styles.boxDigitalFieldTitle}>
                Si l'information n'est pas présente mais qu'il existe des indices, je fais une supposition.
              </p>
            )}

            {/* Numeric Input pour la fréquence */}
            <NumericInput
              min={0}
              size={1}
              value={frequency}
              onChange={handleFrequencyChange}
              style={{ input: { height: 38, textAlign: 'center' } }}
              disabled={options.information} // Si l'info existe, le champ est désactivé
            />
            
            {/* Toggle entre Jours, Semaines et Mois */}
            {/* <Form.Label className={styles.TextBold}>Unité de fréquence</Form.Label> */}
            <ToggleButtonGroup
              type="radio"
              name="frequencyUnit"
              value={frequencyUnit}
              onChange={setFrequencyUnit}
            >
              <ToggleButton id="toggle-jours" value="jours">Jours</ToggleButton>  {/* Ajout de l'id */}
              <ToggleButton id="toggle-semaines" value="semaines">Semaines</ToggleButton>  {/* Ajout de l'id */}
              <ToggleButton id="toggle-mois" value="mois">Mois</ToggleButton>  {/* Ajout de l'id */}
            </ToggleButtonGroup>

            {/* Checkbox pour indiquer si l'information est absente */}
            <Form.Check
              type="checkbox"
              label="L'information n'est pas dans le document, je n'ai pas les connaissances, ni accès à des sources d'information externes pour répondre."
              checked={infoNotInDocument}
              onChange={() => setInfoNotInDocument(!infoNotInDocument)}
            />
          </div>

          
          <div>
            <CustomTable tableItems={itemlist} removeItem={removeItem} updateItemCount={updateItemCount} />
          </div>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default EmailFormCard;
