import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import styles from '../FormComponents.module.scss';
import NumericInput from 'react-numeric-input';
import CustomTable from '../genericCustom/CustomTable';
import Button from 'react-bootstrap/Button';
import { DigitalBoxData, BoxItemType, InformationSourceData } from '../../model/simulationDataModel';
import { useState } from 'react';
import classNames from 'classnames';
import DigitalItemDropbox from '../genericCustom/DigitalItemDropbox';
import InformationSource from '../InformationSource';

interface Props<T> {
    options: {
        name: T;
        type: T;
        id: T;
        placeholder: T;
        informationSourceData?: InformationSourceData;
    },
    digitalData?: DigitalBoxData;
    setValues?: any
}

function FormBoxDigital<T extends string>({ options, digitalData, setValues }: Props<T>) {

    const [digitalBoxValues, setDigitalBoxValues] = useState<DigitalBoxData>({
        optionName: options.name
    });

    const [itemlist, setItemlist] = useState<BoxItemType[]>([]);

    const [selectedItem, setSelectedItem] = useState({ value: '', label: '' });
    const [selectedItemCount, setSelectedItemCount] = useState<number>(0);
    const [selectedItemRequired, setSelectedItemRequired] = useState(false);

    function handleValuesChange(newList: BoxItemType[]) {
        setDigitalBoxValues({
            ...digitalBoxValues,
            itemList: newList
        });

        digitalData = digitalBoxValues;
        setValues(digitalData);
    }

    const setCount = (value: any) => {
        setSelectedItemCount(value);
    };

    //Modif pour réinitialiser le placeholder Description à vide après avoir choisi une valeur
    const addItem = () => {
        if (selectedItem.label !== "") {
            // Vérifier si l'élément existe déjà dans itemlist
            const existingItemIndex = itemlist.findIndex(item => item.name === selectedItem.label);
    
            if (existingItemIndex !== -1) {
                // Si l'élément existe, mettre à jour la quantité
                const updatedItemList = [...itemlist];

                // updatedItemList[existingItemIndex].count += selectedItemCount; // Ajouter à la quantité existante
           
                setItemlist(updatedItemList);
                handleValuesChange(updatedItemList);
            } else {
                // Si l'élément n'existe pas, l'ajouter à la liste
                const newItem = { count: selectedItemCount, name: selectedItem.label };
                const newItemList = [...itemlist, newItem];
                setItemlist(newItemList);
                handleValuesChange(newItemList);
            }
    
            // Réinitialiser selectedItem et le compteur
            setSelectedItem({ value: '', label: '' });
            setSelectedItemCount(0);
            setSelectedItemRequired(false);
        } else {
            setSelectedItemRequired(true);
        }
    };

    // const addItem = () => {
    //     if (selectedItem.label != "") {
    //         itemlist.push({ count: selectedItemCount, name: selectedItem.label });
    //         setItemlist(itemlist);
    //         handleValuesChange(itemlist);
    //     }

    //     setSelectedItemRequired(selectedItem.label == "");
    // }

    const removeItem = (index: any) => {
        itemlist.splice(index, 1);
        handleValuesChange(itemlist);
    }

    const updateItemCount = (value: number, index: number) => {
        if (itemlist[index]) {
            itemlist[index].count = value;
        }

        setItemlist(itemlist);
        handleValuesChange(itemlist);
    }

    const setSourceData = (sourceData: any) => {
        digitalBoxValues.informationSource = sourceData;
        digitalData = digitalBoxValues;
        setValues(digitalData);
    }

    return (
        <div className={styles.boxDigital}>
            <Card style={{ borderRadius: "4px 4px 0px 0px" }} className={styles.boxItem}>
                <Card.Body >
                    <div>
                        <Form.Group>
                            <Form.Label className={styles.TextBold}>{options.name}</Form.Label>
                            <div className={classNames(styles.boxDigitalHeadTitle, styles.required)}> Sélectionnez chaque produit ainsi que le nombre de personnes auxquelles il a été distribué. </div>
                            <p className={styles.boxDigitalFieldTitle}> Par exemple, si trois collaborateurs reçoivent un Dell Latitude 5430, sélectionnez le modèle "Dell Latitude 5430" puis rentrez "3" en nombre d'exemplaire, enfin cliquez sur "Ajouter 3 exemplaires".
                                Si des appareils à renseigner sont des ordinateurs Talan ou bien des ordinateurs reconditionnés, sélectionnez l'option appropriée, sinon sélectionnez le modèle approprié ou un modèle équivalent.</p>
                            <div className={styles.boxDigitalInput}>
                                <DigitalItemDropbox setSelectedItem={setSelectedItem} selectedItem={selectedItem}></DigitalItemDropbox>
                                <span style={{ float: 'right' }}><NumericInput style={{ input: { height: 38, textAlign: 'center' } }} min={0} size={1} onChange={(e) => setCount(e)} />
                                </span>
                            </div>
                            {selectedItemRequired &&
                                <div className={styles.textRequired} > Vous devez Selectionner un produit pour ajouter un équipement.</div>
                            }
                            <div className={styles.addItem}>
                                <Button className={styles.addItemButton} onClick={addItem}>Ajouter +</Button>
                            </div>
                            <div>
                                <CustomTable tableItems={itemlist} removeItem={removeItem} updateItemCount={updateItemCount}></CustomTable>
                            </div>
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
            {itemlist.length > 0 &&
                <Card style={{ borderRadius: " 0px 0px 4px 4px" }} className={styles.informationSource}>
                    <Card.Body>
                        <InformationSource
                            setSourceValues={setSourceData} />
                    </Card.Body>
                </Card>
            }
        </div>
    )
} export default FormBoxDigital;