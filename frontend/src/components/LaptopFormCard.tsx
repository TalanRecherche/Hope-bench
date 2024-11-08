import { Form, Card, Button } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import DigitalItemDropbox from './genericCustom/DigitalItemDropbox';
import CustomTable from './genericCustom/CustomTable';
import styles from './FormComponents.module.scss';
import { BoxItemType } from '../model/simulationDataModel';
import classNames from 'classnames';

interface LaptopFormCardProps {
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

const LaptopFormCard = ({
  options,
  itemlist,
  selectedItem,
  setSelectedItem,
  // selectedItemCount,
  setCount,
  addItem,
  removeItem,
  updateItemCount,
  selectedItemRequired
}: LaptopFormCardProps) => {
  return (
    <Card style={{ borderRadius: "4px 4px 0px 0px" }} className={styles.boxItem}>
      <Card.Body>
        <Form.Group>
          <Form.Label className={styles.TextBold}>{options.name}</Form.Label>
          <div className={classNames(styles.boxDigitalHeadTitle, styles.titleCard)}>
            Sélectionnez chaque produit ainsi que le nombre de personnes auxquelles il a été distribué.
          </div>
          <p className={styles.boxDigitalFieldTitle}>
            Par exemple, si trois collaborateurs reçoivent un Dell Latitude 5430, sélectionnez le modèle "Dell Latitude 5430" puis rentrez "3" en nombre d'exemplaire, enfin cliquez sur "Ajouter 3 exemplaires".
            Si des appareils à renseigner sont des ordinateurs Talan ou bien des ordinateurs reconditionnés, sélectionnez l'option appropriée, sinon sélectionnez le modèle approprié ou un modèle équivalent.
          </p>
          <div className={styles.boxDigitalInput}>
            <DigitalItemDropbox setSelectedItem={setSelectedItem} selectedItem={selectedItem} />
            <span style={{ float: 'right' }}>
              <NumericInput style={{ input: { height: 38, textAlign: 'center' } }} min={0} size={1} onChange={setCount} />
            </span>
          </div>
          {selectedItemRequired && (
            <div className={styles.textRequired}>Vous devez sélectionner un produit pour ajouter un équipement.</div>
          )}
          <div className={styles.addItem}>
            <Button className={styles.addItemButton} onClick={addItem}>Ajouter +</Button>
          </div>
          <div>
            <CustomTable tableItems={itemlist} removeItem={removeItem} updateItemCount={updateItemCount} />
          </div>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default LaptopFormCard;
