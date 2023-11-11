const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

/**
 * Format a date object into a human-readable time
 * For values less than a day, this will be formatted as a relative timespan (ie: 3 hours ago)
 * For values >= a day, this will be formatted as a date/time "at 4:27 PM on 7/31"
 * @param {Date} dateObj the date object to format
 */
export function niceTime(dateObj) {
    let current = new Date().getTime();
    let dateNumber = dateObj.getTime();
    let offset = current - dateNumber;
    if (offset < ONE_MINUTE)
        return "just now";
    else if (offset < ONE_MINUTE * 2)
        return "1 minute ago";
    else if (offset < ONE_HOUR)
        return `${Math.round(offset / ONE_MINUTE)} minutes ago`;
    else if (offset < ONE_HOUR * 2)
        return "1 hour ago";
    else if (offset < ONE_DAY)
        return `${Math.round(offset / ONE_HOUR)} hours ago`;
    else
        return formatTime(dateObj);
}

/**
 * 
 * @param {Date} dateObj 
 */
function formatTime(dateObj) {
    let hour = `${dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours()}`;
    let minute = dateObj.getMinutes() < 10 ? `0${dateObj.getMinutes()}` : `${dateObj.getMinutes()}`;
    let ap = dateObj.getHours() > 12 ? 'PM' : 'AM';
    let shortDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    return `at ${hour}:${minute} ${ap} on ${shortDate}`;
}