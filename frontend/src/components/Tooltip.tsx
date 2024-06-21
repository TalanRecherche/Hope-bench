import ReactTooltip from "react-bootstrap/Tooltip";
import OverlayTrigger, {OverlayTriggerProps} from "react-bootstrap/OverlayTrigger";

interface Props extends Omit<OverlayTriggerProps, 'overlay'> {
    title: string
}

const Tooltip = ({title, ...props}: Props) => (
    <OverlayTrigger
        overlay={<ReactTooltip>{title}</ReactTooltip>}
        {...props}
    />
);

export default Tooltip;