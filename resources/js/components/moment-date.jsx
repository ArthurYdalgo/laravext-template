import moment from "moment";
import MomentDateTime from "./moment-date-time";

const MomentDate = ({date, format='DD/MM/YYYY', style, fallback = '--/--/----', className, ...props}) => {
    return <MomentDateTime dateTime={date} format={format} style={style} fallback={fallback} className={className} {...props} />
}

export default MomentDate;