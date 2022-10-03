import moment from 'moment'

export function formatDate (value: Date, format: string) {
  if (format === 'standard') {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  } else if (format === 'complete') {
    return moment(value).format('llll')
  } else {
    return moment(String(value)).format(format)
  }
}

export const timeLapsed = (value: Date | string) => {
  // console.log('using timeLapsed filter', value)
  if (value) {
    const timeStamp = moment(value)
    const now = moment()
    const daysLapsed = now.diff(timeStamp, 'days')
    const hrsLapsed = now.diff(timeStamp, 'hours')
    const timeLapsed = now.diff(timeStamp, 'minutes')
    if (daysLapsed) {
      return daysLapsed > 1 ? `${daysLapsed} days ago` : 'yesterday'
    }
    if (hrsLapsed) {
      return hrsLapsed > 1 ? `${hrsLapsed} hrs ago` : 'an hour ago'
    }

    // return timeLapsed if difference is not days or hours
    return timeLapsed > 1 ? `${timeLapsed} mins ago` : 'now'
  }
}
