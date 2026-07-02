import moment from "moment";
import MomentDateTime from "./moment-date-time";

const MomentTime = ({time, format='HH:mm', style, fallback = '--:--', className, ...props}) => {
    return <MomentDateTime dateTime={time} format={format} style={style} fallback={fallback} className={className} {...props} />
}

export default MomentTime;