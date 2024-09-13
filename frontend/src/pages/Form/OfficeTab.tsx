import FormBoxOffice from "../../components/formBox/FormBoxOffice";
import { InformationSourceTypes } from "../../components/InformationSource";

const OfficeTab = () => (
    <FormBoxOffice informationSourceType={InformationSourceTypes.fromCollaborator}></FormBoxOffice>
)
export default OfficeTab