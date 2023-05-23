import { reactive, ref, computed } from "vue";
import "@/use";
import axios from "axios";

const DATE = reactive(ref(new Date()));
let global_notes = reactive(
    ref([
        // {
        //     id: "1",
        //     title: "1",
        //     content: "1",
        //     start_date: "2023-03-02 06:00:00",
        //     end_date: "2023-03-03 06:01:00",
        //     type: "notes",
        // },
        // {
        //     id: "2",
        //     title: "Новый год",
        //     content:
        //         "Новый год начали праздновать на территории Казахстана в середине XIX века, когда здесь появились русские переселенцы. Со временем он стал одним из самых любимых праздников. Новый год ожидают с особым нетерпением и трепетом, а подготовку к празднику начинают задолго до его наступления. Такое отношение формируется ещё в детстве, так как родители именно на Новый год, стараются создать и сохранить для своих детей атмосферу волшебной сказки и воспитать в них веру в добро. Главный герой новогодних праздников в Казахстане Аяз Ата (Дед Мороз), согласно традиции, появляется с мешком подарков и праздничного настроения.\r\n\r\nВ каждой семье 31 декабря принято устраивать маленький пир, на котором родные и друзья собираются, чтобы проводить Старый год и ровно в полночь встретить Новый. Звучат новогодние тосты и поздравления, небо озаряется салютами и фейерверками.\r\n\r\nНекоторые жители Казахстана, особенно в мегаполисах, предпочитают провести новогоднюю ночь в шумной компании на одном из праздничных мероприятий, которые традиционно устраиваются почти в каждом ресторане, баре или ночном клубе.",
        //     type: "task",
        //     start_date: "2023-03-05 00:00:00",
        //     end_date: "2023-03-06 01:01:00",
        // },
        // {
        //     id: "3",
        //     title: "до днюхи",
        //     content:
        //         "Новый год начали праздновать на территории Казахстана в середине XIX века, когда здесь появились русские переселенцы. Со временем он стал одним из самых любимых праздников. Новый год ожидают с особым нетерпением и трепетом, а подготовку к празднику начинают задолго до его наступления. Такое отношение формируется ещё в детстве, так как родители именно на Новый год, стараются создать и сохранить для своих детей атмосферу волшебной сказки и воспитать в них веру в добро. Главный герой новогодних праздников в Казахстане Аяз Ата (Дед Мороз), согласно традиции, появляется с мешком подарков и праздничного настроения.\r\n\r\nВ каждой семье 31 декабря принято устраивать маленький пир, на котором родные и друзья собираются, чтобы проводить Старый год и ровно в полночь встретить Новый. Звучат новогодние тосты и поздравления, небо озаряется салютами и фейерверками.\r\n\r\nНекоторые жители Казахстана, особенно в мегаполисах, предпочитают провести новогоднюю ночь в шумной компании на одном из праздничных мероприятий, которые традиционно устраиваются почти в каждом ресторане, баре или ночном клубе.",
        //     type: "holiday",
        //     start_date: "2023-03-08 09:44:00",
        //     end_date: "2023-03-12 14:59:59",
        // },
        // {
        //     id: "4",
        //     title: "new format",
        //     content:
        //         "ce0e172307d3 = unchecked:Создать интерфейс для парсера газет;unchecked:fdsa;unchecked:treq;unchecked:bfs;unchecked:dtn;unchecked:wew;unchecked:bs;unchecked:dntrq;unchecked:wb;unchecked:fwbn;unchecked:wf;unchecked:j;unchecked:yue;unchecked:sbfa;unchecked:wn;unchecked:twa;unchecked:vdnhga;unchecked:rj;unchecked:ytmhagrn",
        //     type: "task",
        //     start_date: "2023-03-08 09:44:00",
        //     end_date: "2023-03-12 14:59:59",
        // },
    ])
);

function minusMonth() {
    if (DATE.value.getFullYear() == 2000) return;
    DATE.value = DATE.value.minus("month", 1);
}
function plusMonth() {
    if (DATE.value.getFullYear() == new Date().getFullYear() + 10) return;
    DATE.value = DATE.value.plus("month", 1);
}

function minusYear() {
    if (DATE.value.getFullYear() == 2000) return;
    DATE.value = DATE.value.minus("year", 1);
}
function plusYear() {
    if (DATE.value.getFullYear() == new Date().getFullYear() + 10) return;
    DATE.value = DATE.value.plus("year", 1);
}
function today() {
    DATE.value = new Date();
}
function getGlobal_note() {
    axios
        .get(`/ru/notes/get-notes`)
        .then((response) => {
            if (response.status == 200) {
                console.log(response.data);
                global_notes.value = response.data.map((note) => {
                    note.start_date = new Date(note.start_date).format(
                        "Y-m-d h:i:s"
                    );
                    note.end_date = new Date(note.end_date).format(
                        "Y-m-d h:i:s"
                    );
                    return note;
                });
            }
        })
        .catch((error) => console.error(error));
}
getGlobal_note();
function pushGlobal_note(note) {
    console.log(note);

    let form = document.createElement("form");

    let formData = new FormData(form);

    formData.append("title", note.title);
    formData.append("content", note.content);
    formData.append("start_date", note.start_date);
    formData.append("end_date", note.end_date);
    formData.append("type", note.type);

    console.log(formData);

    axios
        .post(`/ru/notes/create-note`, formData)
        .then((response) => {
            console.log(response);
            if (response.data.result == 1) {
                getGlobal_note();
            }
        })
        .catch((error) => console.error(error));
}
function editGlobal_note({ id, start_date, end_date, content, type, title }) {
    console.log({ id, start_date, end_date, content, type, title });

    global_notes.value.forEach((note) => {
        if (note.id == id) {
            let form = document.createElement("form");

            let formData = new FormData(form);

            formData.append("id", id);
            formData.append("title", title);
            formData.append("content", content);
            formData.append("start_date", start_date);
            formData.append("end_date", end_date);
            formData.append("type", type);

            console.log(formData);

            axios
                .post(`/ru/notes/update-note`, formData)
                .then((response) => {
                    console.log(response);
                    if (response.data.result == 1) {
                        //getGlobal_note()
                        note.title = title;
                        note.content = content;
                        note.start_date = start_date;
                        note.end_date = end_date;
                        note.type = type;
                    }
                })
                .catch((error) => console.error(error));
        }
    });
}
function deleteGlobal_note(id) {
    console.log(id);

    let form = document.createElement("form");

    let formData = new FormData(form);

    formData.append("id", id);

    console.log(formData);

    axios
        .post(`/ru/notes/delete-note`, formData)
        .then((response) => {
            console.log(response);
            if (response.data.result == 1) {
                //getGlobal_note()
                global_notes.value = global_notes.value.filter(
                    (note) => note.id != id
                );
            }
        })
        .catch((error) => console.error(error));
}

let __calendar__ = () => {
    var date = new Date(
        Date.UTC(DATE.value.getFullYear(), DATE.value.getMonth(), 1)
    );
    var end_date = new Date(
        Date.UTC(DATE.value.getFullYear(), DATE.value.getMonth() + 1, 1)
    );
    end_date.minus("date", 1);
    let calendar = [];

    while (date.valueOf() <= end_date.valueOf()) {
        calendar[date.format("Y-m-d")] = [];
        date.plus("date", 1);
    }

    return calendar;
};

function getSortedDate(object) {
    let sorted_global_notes = [...Object.keys(object)];

    sorted_global_notes.sort(
        (s_note1, s_note2) =>
            new Date(s_note1.split(" to ")[0]).valueOf() -
            new Date(s_note2.split(" to ")[0]).valueOf()
    );

    return sorted_global_notes;
}

function ymd(date) {
    return new Date(date).format("Y-m-d");
}

let calendar = computed(() => {
    let __queue__ = __calendar__();

    let period_queue_array = {};

    global_notes.value.sort(
        (s_note1, s_note2) =>
            new Date(s_note1.start_date).valueOf() -
            new Date(s_note2.start_date).valueOf()
    );

    Object.keys(__queue__).forEach((queue_key) => {
        global_notes.value.forEach((note) => {
            let own_index = 0;
            //let period_array = period.split(' to ');
            if (ymd(note.start_date) == queue_key) {
                global_notes.value.forEach((queue_note) => {
                    //let period_queue_period_array = period_queue_period.split(' to ');
                    //if (queue_key == '2023-01-22' || queue_key == '2023-01-21') {
                    //}
                    if (
                        new Date(ymd(queue_note.start_date)).valueOf() <=
                            new Date(queue_key).valueOf() &&
                        new Date(queue_key).valueOf() <=
                            new Date(ymd(queue_note.end_date)).valueOf()
                    ) {
                        //if ((own_index + 1) == period_queue_array[period_queue_period]) {
                        //    own_index++
                        //}
                        if (
                            !(
                                new Date(queue_key).valueOf() >
                                new Date(ymd(queue_note.end_date)).valueOf()
                            )
                        ) {
                            if (
                                own_index >=
                                period_queue_array[
                                    ymd(queue_note.start_date) +
                                        " to " +
                                        ymd(queue_note.end_date)
                                ]
                            ) {
                                own_index++;
                            }
                        }
                    }
                });
                getSortedDate(period_queue_array).forEach(
                    (period_queue_period) => {
                        let period_queue_period_array =
                            period_queue_period.split(" to ");
                        if (
                            new Date(period_queue_period_array[0]).valueOf() <=
                                new Date(queue_key).valueOf() &&
                            new Date(queue_key).valueOf() <=
                                new Date(period_queue_period_array[1]).valueOf()
                        ) {
                            if (
                                period_queue_period !=
                                    note.start_date + " to " + note.end_date &&
                                period_queue_array[period_queue_period] ==
                                    own_index
                            ) {
                                own_index++;
                            }
                        }
                    }
                );
                period_queue_array[
                    ymd(note.start_date) + " to " + ymd(note.end_date)
                ] = own_index;
            }
        });
    });

    var date = new Date(
        Date.UTC(DATE.value.getFullYear(), DATE.value.getMonth(), 1)
    );
    var end_date = new Date(
        Date.UTC(DATE.value.getFullYear(), DATE.value.getMonth() + 1, 1)
    );
    end_date.minus("date", 1);
    let calendar = [];
    while (parseInt(date.format("w")) != 1) {
        date.minus("date", 1);
    }
    date.minus("date", 1);

    while (parseInt(end_date.format("w")) != 1) {
        end_date.plus("date", 1);
    }

    while (date.valueOf() <= end_date.valueOf()) {
        date.plus("date", 1);
        let period_key = "";
        let result = [];
        global_notes.value.forEach((note) => {
            period_key = ymd(note.start_date) + " to " + ymd(note.end_date);
            if (
                new Date(ymd(note.start_date)).valueOf() <= date.valueOf() &&
                date.valueOf() <= new Date(ymd(note.end_date)).valueOf()
            ) {
                result[period_queue_array[period_key]] = note;
            }
        });

        let new_result = [];

        result.forEach((note) => {
            if (note.start_date != undefined && note.end_date != undefined) {
                let _period = note.start_date + " to " + note.end_date;
                global_notes.value.forEach((note2) => {
                    if (note2.start_date + " to " + note2.end_date == _period) {
                        new_result.push(note2);
                    }
                });
            }
        });
        result = new_result;

        calendar.push({
            date: date.format("Y-m-d") + " 00:00:00",
            notes: result ?? [],
        });
    }

    return calendar;
});

export {
    calendar,
    DATE,
    minusMonth,
    plusMonth,
    minusYear,
    plusYear,
    today,
    pushGlobal_note,
    deleteGlobal_note,
    editGlobal_note,
};
