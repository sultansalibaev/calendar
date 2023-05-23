const dateTypes = {
    date: "etDate",
    "week-day": "etDay",
    month: "etMonth",
    year: "etFullYear",
};
const dateFormats = {
    Y: "getFullYear",
    m: "getMonth",
    d: "getDate",
    h: "getHours",
    i: "getMinutes",
    s: "getSeconds",
    w: "getDay",
};
const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];
Date.prototype.plus = function (type, count) {
    this["s" + dateTypes[type]](this["g" + dateTypes[type]]() + count);
    return this
};
Date.prototype.minus = function (type, count) {
    this["s" + dateTypes[type]](this["g" + dateTypes[type]]() - count);
    return this
};
function getFormatDate(date) {
    if (date < 10) {
        return "0" + date;
    }
    return date;
}
Date.prototype.format = function (format, bool) {
    return Object.keys(dateFormats).reduce((oldFormat, dateFormat) => {
        if (oldFormat.includes(dateFormat)) {
            let plus = 0;

            if (dateFormat == "m") {
                plus = 1;
            }

            let formatDate;
            
            if (dateFormat == "w") {
                formatDate = this[dateFormats[dateFormat]]();
                if (formatDate == 0) {
                    formatDate = 7
                }
            }
            else {
                let format_view = bool && dateFormat == 'm' ? months[this[dateFormats[dateFormat]]()] : plus + this[dateFormats[dateFormat]]();
                formatDate = format_view;
            }

            return oldFormat.replace(
                dateFormat,
                getFormatDate(formatDate)
            );
        } else {
            return oldFormat;
        }
    }, format);
};