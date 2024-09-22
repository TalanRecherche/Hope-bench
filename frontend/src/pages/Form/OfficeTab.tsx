import FormBoxOffice from "../../components/formBox/FormBoxOffice";
import { InformationSourceTypes } from "../../components/InformationSource";

function OfficeTab() {
    const handleSourceDataReceive = () => {
        console.log(handleSourceDataReceive);
    };

    return (
        <FormBoxOffice setValues={handleSourceDataReceive} informationSourceType={InformationSourceTypes.fromCollaborator} options={{}}></FormBoxOffice>
    );
}
export default OfficeTab