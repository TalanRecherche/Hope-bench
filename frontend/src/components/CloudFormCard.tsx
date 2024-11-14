import { Form, Card, Row, Col } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
// import DigitalItemDropbox from './genericCustom/DigitalItemDropbox';
import CustomTable from './genericCustom/CustomTable';
import styles from './FormComponents.module.scss';
import { BoxItemType } from '../model/simulationDataModel';
import classNames from 'classnames';
import { useState } from 'react';

interface CloudFormCardProps {
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

const CloudFormCard = ({
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
}: CloudFormCardProps) => {
  // // State pour la fréquence, l'unité et la checkbox "L'information n'est pas dans le document"
  // const [frequency, setFrequency] = useState<number>(0);
  // const [frequencyUnit, setFrequencyUnit] = useState<string>('jours'); // Par défaut en "jours"
  // const [infoNotInDocument, setInfoNotInDocument] = useState<boolean>(false);

  const [isCloudStorageRequired, setIsCloudStorageRequired] = useState<'oui' | 'non'>('non');

  const handleCloudStorageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCloudStorageRequired(e.target.value as 'oui' | 'non');
  };

  // State pour les champs fournisseur, région et taille
  const [selectedFournisseur, setSelectedFournisseur] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [size, setSize] = useState<number>(0);
  const [isSizeInTB, setIsSizeInTB] = useState<boolean>(false); // Toggle pour Go/To


  // Fonction pour gérer le changement de fournisseur
  const handleFournisseurChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFournisseur(e.target.value);
  };

  // Fonction pour gérer le changement de région
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };

  // Fonction pour gérer le changement de taille (en Go/To)
  const handleSizeChange = (value: number | null, stringValue: string, input: HTMLInputElement) => {
    console.log(stringValue,input);
    if (value !== null) {
      setSize(value);
    }
  };

  // Fonction pour basculer entre Go et To
  const handleSizeToggle = () => {
    setIsSizeInTB(!isSizeInTB);
  };

  return (
    <Card style={{ borderRadius: "4px 4px 0px 0px" }} className={styles.boxItem}>
      <Card.Body>
        <Form.Group>
          <Form.Label className={styles.TextBold}>{options.name}</Form.Label>
          <p className={styles.boxDigitalFieldTitle}>
            Indiquer même avec une marge d'erreur possible
          </p>
         
          <div className={styles.frequencySection}>
            <Form.Label className={classNames(styles.boxDigitalHeadTitle, styles.titleCard)}>Est ce que cette mission est sujette à générer du stockage cloud supplémentaire (en plus des données déjà présentes chez le client avant la mission)?</Form.Label>
            {/* Boutons radio pour la réponse Oui/Non */}
            {/* Boutons radio pour la réponse Oui/Non */}
            <div className="mb-3">
              <Form.Check
                type="radio"
                id="radio-oui"
                label="Oui"
                name="cloudStorageQuestion"
                value="oui"
                checked={isCloudStorageRequired === 'oui'}
                onChange={handleCloudStorageChange}
              />
              <Form.Check
                type="radio"
                id="radio-non"
                label="Non"
                name="cloudStorageQuestion"
                value="non"

                checked={isCloudStorageRequired === 'non'}
                onChange={handleCloudStorageChange}
              />
            </div>
          </div>

          {/* Sélection du fournisseur */}
          <Form.Label className={classNames(styles.boxDigitalHeadTitle, styles.titleCard)}>
            Sélectionnez le fournisseur
          </Form.Label>
          <Form.Select
            value={selectedFournisseur}
            onChange={handleFournisseurChange}
            className={styles.formSelect}
          >
            <option value="">Choisir un fournisseur</option>
            <option value="fournisseur1">Fournisseur 1</option>
            <option value="fournisseur2">Fournisseur 2</option>
            <option value="fournisseur3">Fournisseur 3</option>
          </Form.Select>

          {/* Sélection de la région */}
          <Form.Label className={classNames(styles.boxDigitalHeadTitle, styles.titleCard)}>
            Sélectionnez la région
          </Form.Label>
          <Form.Select
            value={selectedRegion}
            onChange={handleRegionChange}
            className={styles.formSelect}
          >
            <option value="">Choisir une région</option>
            <option value="region1">Région 1</option>
            <option value="region2">Région 2</option>
            <option value="region3">Région 3</option>
          </Form.Select>

          {/* Taille en Go ou To */}
          <div className="mt-3">
            <Form.Label className={classNames(styles.boxDigitalHeadTitle, styles.titleCard)}>
              Taille
            </Form.Label>
            <Row className="mb-3">
              <Col md={8}>
                <NumericInput
                  style={{ input: { height: 38, textAlign: 'center' } }}
                  min={0}
                  size={1}
                  value={size}
                  onChange={handleSizeChange}
                  className={styles.sizeInput}
                />
              </Col>
              <Col md={4} className="d-flex align-items-center">
                <Form.Check
                  type="switch"
                  id="size-toggle"
                  label={
                   
                  
                
                <>
                  <span style={{ marginRight: 8 }}> {isSizeInTB ? " To" : " Go"}</span>
                 
                </>
                  }
                checked={isSizeInTB}
                onChange={handleSizeToggle}
                className={styles.sizeToggle}
                />
              </Col>
            </Row>


          </div>





          <div>
            <CustomTable tableItems={itemlist} removeItem={removeItem} updateItemCount={updateItemCount} />
          </div>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default CloudFormCard;
