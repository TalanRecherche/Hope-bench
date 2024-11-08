import { Form, Card } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';

import CustomSwitch from './genericCustom/CustomSwitch';
import CustomTable from './genericCustom/CustomTable';
import styles from './FormComponents.module.scss';
import { BoxItemType, CustomSwitchOptions } from '../model/simulationDataModel';
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
  // selectedItem,
  // setSelectedItem,
  // selectedItemCount,
  // setCount,
  // addItem,
  removeItem,
  updateItemCount,
  // selectedItemRequired
}: EmailFormCardProps) => {
  // State pour la fréquence, l'unité et la checkbox "L'information n'est pas dans le document"
  const [frequency, setFrequency] = useState<number>(0);
  const [frequencyUnit,setFrequencyUnit] = useState<string>('jours'); // Par défaut en "jours"
  console.log(frequencyUnit);
  const [infoNotInDocument, setInfoNotInDocument] = useState<boolean>(false);

  // Fonction pour gérer l'événement onChange de NumericInput
  const handleFrequencyChange = (value: number | null, stringValue: string, input: HTMLInputElement) => {
    console.log(stringValue,input);
    if (value !== null) {
      setFrequency(value); // Met à jour le state frequency avec la valeur numérique
    }
  };

  // Fonction de mise à jour pour le switch personnalisé (choix de l'unité)
  const handleUnitChange = (unit: string) => {
    setFrequencyUnit(unit);
  };

  const switchOptions: CustomSwitchOptions = [
    { label: 'Jours', checked: true },
    { label: 'Semaines', checked: false },
    { label: 'Mois', checked: false }
  ];

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



            <CustomSwitch
              options={switchOptions}
              sendSwitchValue={handleUnitChange}
              floatingContainer={false}
            />


            {/* Checkbox pour indiquer si l'information est absente */}
            <div style={{ marginTop: '20px' }}>
              <Form.Check
                type="checkbox"
                label="L'information n'est pas dans le document, je n'ai pas les connaissances, ni accès à des sources d'information externes pour répondre."
                checked={infoNotInDocument}
                onChange={() => setInfoNotInDocument(!infoNotInDocument)}
              />
            </div>
          </div>


          <div>
            <CustomTable tableItems={itemlist} removeItem={removeItem} updateItemCount={updateItemCount} />
          </div>
        </Form.Group>
      </Card.Body>
    </Card >
  );
};

export default EmailFormCard;
