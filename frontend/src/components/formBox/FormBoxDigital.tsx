import { useState } from 'react';
import LaptopFormCard from '../LaptopFormCard';
import EmailFormCard from '../EmailFormCard';
import CloudFormCard from '../CloudFormCard';
import { Card} from 'react-bootstrap';


import styles from '../FormComponents.module.scss';



import { DigitalBoxData, BoxItemType, InformationSourceData } from '../../model/simulationDataModel';


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
        optionName: options.name,


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

            {/* card PC */}
            {options.id === 'laptop' && (
                <LaptopFormCard
                    options={options}
                    itemlist={itemlist}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    selectedItemCount={selectedItemCount}
                    setCount={setCount}
                    addItem={addItem}
                    removeItem={removeItem}
                    updateItemCount={updateItemCount}
                    selectedItemRequired={selectedItemRequired}
                />
            )} 

            {/* si email */}
            {options.id === 'email' && (
                <EmailFormCard
                    options={options}
                    itemlist={itemlist}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    selectedItemCount={selectedItemCount}
                    setCount={setCount}
                    addItem={addItem}
                    removeItem={removeItem}
                    updateItemCount={updateItemCount}
                    selectedItemRequired={selectedItemRequired}
                />
            )} 

            {/* si cloud */}
            {options.id === 'storage' && (
                <CloudFormCard
                    options={options}
                    itemlist={itemlist}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    selectedItemCount={selectedItemCount}
                    setCount={setCount}
                    addItem={addItem}
                    removeItem={removeItem}
                    updateItemCount={updateItemCount}
                    selectedItemRequired={selectedItemRequired}
                />
            )} 





                {
                    itemlist.length > 0 &&
                        <Card style={{ borderRadius: " 0px 0px 4px 4px" }} className={styles.informationSource}>
                            <Card.Body>
                                <InformationSource
                                    setSourceValues={setSourceData} />
                            </Card.Body>
                        </Card>
                }
        </div>
    
            )}

export default FormBoxDigital;