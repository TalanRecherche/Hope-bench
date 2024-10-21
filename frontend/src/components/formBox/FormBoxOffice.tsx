import styles from '../FormComponents.module.css';
import Card from 'react-bootstrap/Card';
import NumericInput from 'react-numeric-input';
import CustomSwitch from '../genericCustom/CustomSwitch';
import Button from 'react-bootstrap/Button';
import InformationSource from '../InformationSource';
import { BoxItemType, OfficeBoxData } from '../../model/simulationDataModel';
import classNames from 'classnames';
import { CustomSwitchOptions } from '../../model/simulationDataModel';
import { useState } from 'react';
import CustomTable from '../genericCustom/CustomTable';

interface Props {
    setValues?: any
}

function FormBoxOffice({ setValues }: Props) {

    const [officeBoxValues, setOfficeBoxValues] = useState<OfficeBoxData>({ itemList: [] });
    const [itemlist, setItemlist] = useState<BoxItemType[]>([]);

    const switchOptions: CustomSwitchOptions = {
        option1: {
            label: 'Recto',
            checked: true
        },
        option2: {
            label: 'Recto-Verso',
            checked: false
        }
    };

    const [selectedItemCount, setSelectedItemCount] = useState<number>(0);
    const [selectedItem, setSelectedItem] = useState<string>(switchOptions.option1.label);
    const [selectedItemRequired, setSelectedItemRequired] = useState(false);

    const setCount = (value: any) => {
        setSelectedItemCount(value);
    };

    function handleChange(value: any) {
        setSelectedItem(value);
    }

    function handleValuesChange(newList: BoxItemType[]) {
        setOfficeBoxValues({
            ...officeBoxValues,
            itemList: newList
        });

        setValues(officeBoxValues);
    }

    //Modif pour éviter d'avoir des lignes en doublon, par exemple 2 lignes recto 
    const addItem = () => {
        if (selectedItemCount !== 0) {
            // Vérifie si l'élément existe déjà
            const itemExists = itemlist.some(item => item.name === selectedItem);
            
            if (itemExists) {
                alert("Cet élément existe déjà."); // Message d'erreur ou autre
                return; // Ne pas ajouter si c'est un doublon
            }
    
            // Ajoute l'élément à la liste
            const newItem = { count: selectedItemCount, name: selectedItem };
            const updatedList = [...itemlist, newItem]; // Utilise une nouvelle référence pour l'état
    
            setItemlist(updatedList);
            handleValuesChange(updatedList);
        } else {
            setSelectedItemRequired(true);
        }
    };
    


    // const addItem = () => {
    //     if (selectedItemCount != 0) {
    //         itemlist.push({ count: selectedItemCount, name: selectedItem });
    //         setItemlist(itemlist);
    //         handleValuesChange(itemlist);
    //     }

    //     setSelectedItemRequired(selectedItemCount == 0);
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
        officeBoxValues.informationSource = sourceData;
        setValues(officeBoxValues);
    }

    return (
        <div className={styles.boxOffice}>
            <Card style={{ borderRadius: " 4px 4px 0px 0px" }} className={styles.boxItem}>
                <Card.Body >
                    <div>
                        <span className={classNames(styles.labelSemiBold, styles.required)}> Copies papier utilisées </span>
                    </div>

                    <div className={styles.boxOfficeInputs}>
                        <span>
                            <NumericInput style={{ input: { height: 28, textAlign: 'center' } }} min={0} size={1} onChange={(e) => setCount(e)} />
                        </span>
                        <CustomSwitch options={switchOptions} sendSwitchValue={(e: any) => handleChange(e)} floatingContainer={false}></CustomSwitch>
                    </div>
                    {selectedItemRequired &&
                        <div className={styles.textRequired} > Vous devez saisir un nombre pour ajouter une impression. </div>
                    }
                    <div className={styles.addItem}>
                        <Button className={styles.addItemButton} onClick={addItem}>Ajouter +</Button>
                    </div>
                    <div>
                        <CustomTable tableItems={itemlist} removeItem={removeItem} updateItemCount={updateItemCount}></CustomTable>
                    </div>
                </Card.Body>
            </Card >
            {itemlist.length > 0 &&
                <Card style={{ borderRadius: " 0px 0px 4px 4px" }} className={styles.informationSource}>
                    <Card.Body>
                        <InformationSource
                            setSourceValues={setSourceData} />
                    </Card.Body>
                </Card>
            }
        </div>
    );
}
export default FormBoxOffice;