import CustomCheckboxList from './genericCustom/CustomCheckboxList';

const list = [
    { id: "laptop", name: "Ordinateur portable", checked: true, order: 1 },
    { id: "Smartphone", name: "Smartphone", checked: false, order: 2 },
    { id: "email", name: "Email", checked: true, order: 3 },
    { id: "videoconference", name: "Visioconférence", checked: true, order: 4 },
    { id: "storage", name: "Cloud", checked: true, order: 5 },
    { id: "machineLearning", name: "Machine learning", checked: false, order: 6 }
]
interface Props {
    onDataSend: any
};

const FormDigitalEquipments = ({ onDataSend }: Props) => {
    let displayList: any = [];
    const handleDataReceive = (data: any) => {
        
        displayList = list.filter( l => data.includes(l.id ));
        onDataSend(displayList);
    };
    
    return (
        <CustomCheckboxList
            onDataSend={handleDataReceive}
            title='Sélectionner les sources de pollution'
            subTitle='Plusieurs choix sont possibles'
            list={list}></CustomCheckboxList>
    )    
};
export default FormDigitalEquipments;