const _i18n = {

	'Сегодня': ['Today', 'Бүгін'],

	'Описание ...': ['Description ...', 'Сипаттама ...'],

	'Изменить': ['Change', 'Өзгерту'],
	'Обновить': ['Refresh', 'Жаңарту'],

	'Заголовок ...': ['Heading...', 'Тақырып...'],
	'Добавить задачу': ['Add task', 'Тапсырма қосу'],

	'от': ['from', 'бастап'],
	'до': ['to', 'дейін'],
	
	'Добавить': ['Add', 'Қосу'],

	'Января': ['January','Қаңтар'],
	'Февраля': ['February','Ақпан'],
	'Марта': ['March','Мамыр'],
	'Апреля': ['April','Сәуір'],
	'Мая': ['May','Мамыр'],
	'Июня': ['June','Маусым'],
	'Июля': ['July','Шілде'],
	'Августа': ['August','Тамыз'],
	'Сентября': ['September','Қыркүйек'],
	'Октября': ['October','Қазан'],
	'Ноября': ['November','Қараша'],
	'Декабря': ['December','Желтоқсан'],

	'Воскресенье': ['Sunday', 'Жексенбі'],
	'Понедельник': ['Monday', 'Дүйсенбі'],
	'Вторник': ['Tuesday', 'Сейсенбі'],
	'Среда': ['Wednesday', 'Сәрсенбі'],
	'Четверг': ['Thursday', 'Бейсенбі'],
	'Пятница': ['Friday', 'Жұма'],
	'Суббота': ['Saturday', 'Сенбі'],

	'Январь': ['January', 'Қаңтар'],
	'Февраль': ['February', 'Ақпан'],
	'Март': ['March', 'Наурыз'],
	'Апрель': ['April', 'Сәуір'],
	'Май': ['May', 'Мамыр'],
	'Июнь': ['June', 'Маусым'],
	'Июль': ['July', 'Шілде'],
	'Август': ['August', 'Тамыз'],
	'Сентябрь': ['September', 'Қыркүйек'],
	'Октябрь': ['October', 'Қазан'],
	'Ноябрь': ['November', 'Қараша'],
	'Декабрь': ['December', 'Желтоқсан'],

	'Описание': ['Description', 'Сипаттама'],
	'Пункты': ['Items', 'Элементтер'],
	'Заметки': ['Notes', 'Ескертпелер'],
	'Праздники': ['Holidays', 'Мерекелер'],
	'Задачи': ['Tasks', 'Тапсырмалар'],

};

function getLang() {
    var params = {};

    let tmp_params = window.location.href
        .replace(/\?.*/, "")
        .split("//")
        .join("")
        .split("/");
    for (var p = 0; p < tmp_params.length; p++) {
        var _tmp = tmp_params[p].split("=");

        params[_tmp[0]] = _tmp[1];
    }
    let lang = Object.keys(params)[1];
    return lang;
}
function langIs(lang) {
    return getLang() === lang;
}
console.log(getLang() === 'en');

function getLangIndex() {
    if (langIs("en")) return 0;
    else if (langIs("kz")) return 1;
}

const i18n = (text) => {
    return (langIs("ru") ? text : _i18n[text][getLangIndex()]) + '';
};

export default i18n;
