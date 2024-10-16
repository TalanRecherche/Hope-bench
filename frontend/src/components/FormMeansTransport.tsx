import { useState } from 'react';
import BoxSelectedList from './genericCustom/BoxSelectedList';
import CustomCheckboxList from './genericCustom/CustomCheckboxList';

const list = [
    { id: "plane", name: 'Avion', checked: false, order: 1 },
    { id: "tgv", name: "TGV", checked: false, order: 2 },
    { id: "intercityTrain", name: "Train intercités", checked: false, order: 3 },
    { id: "electicCar", name: "Voiture électrique", checked: false, order: 4 },
    { id: "thermalCar", name: "Voiture thermique", checked: false, order: 5 },
    { id: "rer", name: "RER", checked: false, order: 6 },
    { id: "metro", name: "Metro", checked: false, order: 7 },
    { id: "thermalBus", name: "Bus Thermique", checked: false, order: 8 },
    { id: "electriqueBikeOrScooter", name: "Vélo ou trot. électrique", checked: false, order: 9 },
    { id: "bikeOrWalk", name: "Vélo ou marche", checked: false, order: 10 }
]

interface Props {
    onDataSend: any
};

const FormMeansTransport = ({ onDataSend }: Props) => {
    let displayList: any = [];
    const handleDataReceive = (data: any) => {
        displayList = list.filter(l => data.includes(l.id));
        onDataSend(displayList);
    };

    return (
        <CustomCheckboxList
            onDataSend={handleDataReceive}
            title='Sélectionner les moyens de transport prévu ou à supposer'
            subTitle='Plusieurs choix sont possibles'
            list={list}></CustomCheckboxList>
    );
}
export default FormMeansTransport;