import moment from "moment";

const MomentDateTime = ({dateTime, date, format='DD/MM/YYYY HH:mm', style, fallback = '--/--/---- --:--', className, ...props}) => {
    dateTime = dateTime ?? date;
    return (
        <span style={style} {...props} className={'font-mono ' + className}>{dateTime ? moment(dateTime).format(format) : fallback}</span>
    )
}

export default MomentDateTime;