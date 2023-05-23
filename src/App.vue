<template>
    <create-note :modal_window="modal_window" :note="note" @toggle-modal="toggleModal()" @input-type="selectType" @task-type="taskType"
        :options="options" :task_types="task_types" :fullDate="getFullDate()" @update-input="updateInput" @save-note="saveNotes"></create-note>
    <edit-note :edit_window="edit_window" :task_types="task_types" :note="note" @toggle-edit="toggleEdit()" @input-type="selectType" @task-type="taskType"
        :options="options" @update-input="updateInput" @edit-note="editNote"></edit-note>
    <note-preview :modal_preview="modal_preview" :note="note" @edit-note="updateNote" @delete-note="deleteNote" @toggle-edit="toggleEdit"
        @toggle-preview="togglePreview"></note-preview>
    <div class="w-full">
        <div class="date-picker flex items-center">
            <!--<h1 class="title font-bold">МЕДИА-КАЛЕНДАРЬ</h1>-->
            <h1 class="title font-bold"></h1>
            <div class="switcher today-border flex items-center">
                <span class="today-p-10 cursor-pointer" @click="today()">{{ i18n('Сегодня') }}</span>
            </div>
            <div class="switcher flex items-center">
                <i class="fa fa-angle-left circle cursor-pointer" @click="minusYear()"></i>
                <span class="bd-x-1">{{ DATE.format("Y") }}</span>
                <i class="fa fa-angle-right circle cursor-pointer" @click="plusYear()"></i>
            </div>
            <div class="switcher flex items-center">
                <i class="fa fa-angle-left circle cursor-pointer" @click="minusMonth()"></i>
                <span class="bd-x-1 w-70">{{ i18n(DATE.format("m", true)) }}</span>
                <i class="fa fa-angle-right circle cursor-pointer" @click="plusMonth()"></i>
            </div>
        </div>
        <div class="calendar-header flex justify-between items-center">
            <span>{{ i18n('Понедельник') }}</span>
            <span>{{ i18n('Вторник') }}</span>
            <span>{{ i18n('Среда') }}</span>
            <span>{{ i18n('Четверг') }}</span>
            <span>{{ i18n('Пятница') }}</span>
            <span>{{ i18n('Суббота') }}</span>
            <span>{{ i18n('Воскресенье') }}</span>
        </div>
        <div class="calendar-body flex justify-between items-center" v-for="(week_days, i) in everySeven" :key="i">
            <template v-for="{ date, notes } in week_days" :key="date">
                <span :class="{
                    'text-gray-400 pointer-events-none bg-gray-200':
                        new Date(date).getMonth() != DATE.getMonth(),
                    'cursor-pointer':
                        new Date(date).getMonth() == DATE.getMonth(),
                    'weekdays-off__color':
                        new Date(date).format('w') > 5,
                    'current-date':
                        new Date(date).format('Y-m-d') == new Date().format('Y-m-d'),
                }" @click="toggleModal(date)" :style="{
                    height: 34 + 4 + (([...week_days].sort((date1, date2) => (date1.notes.length - date2.notes.length)))[week_days.length - 1].notes.length * 27) + 'px'
                }">
                    <div class="date">
                        <span>
                            {{ new Date(date).getDate() }}
                        </span>
                    </div>
                    <template v-for="(note, i) in notes" :key="i">
                        <div v-if="(ymd(note.start_date) == ymd(date) || (new Date(date).format('w') == 1))"
                            :class="'note ' + note.type + ` ${ hasUncheckedTasks(note) ? 'disabled' : ''}`" @click.stop="togglePreview(JSON.parse(JSON.stringify(note)))" :style="{
                                left: new Date(date).format('w') == 1 && note.end_date.valueOf() >= date.valueOf() ? leftOffset(date) + '%' : leftOffset(note.start_date) + '%',
                                right: new Date(date).format('w') == 1 && note.end_date.valueOf() >= date.valueOf() ? rightOffset({ start_date: date, end_date: note.end_date }) + '%' : rightOffset(note) + '%',
                                top: (34 + (27 * i)) + 'px',
                            }">
                            &nbsp;&nbsp;{{ note.title }}
                        </div>
                    </template>
                </span>
            </template>
        </div>
    </div>
</template>

<script>
import { calendar, DATE, minusYear, plusYear, minusMonth, plusMonth, today, pushGlobal_note, deleteGlobal_note, editGlobal_note } from "@/use/calendar";
import CreateNote from "@/components/CreateNote.vue";
import EditNote from "@/components/EditNote.vue";
import NotePreview from "@/components/NotePreview.vue";
import i18n from '@/utils/i18n'

export default {
    name: "App",
    components: {
        CreateNote,
        EditNote,
        NotePreview,
    },
    data() {
        return {
            task_types: [
                {
                    name: i18n("Описание"),
                    img: "description",
                },
                {
                    name: i18n("Пункты"),
                    img: "items",
                },
            ],
            options: [
                {
                    name: i18n("Заметки"),
                    img: "notes",
                },
                {
                    name: i18n("Праздники"),
                    img: "holiday",
                },
                {
                    name: i18n("Задачи"),
                    img: "task",
                },
            ],
            modal_window: false,
            edit_window: false,
            modal_preview: false,
            months: [
                i18n("Январь"),
                i18n("Февраль"),
                i18n("Март"),
                i18n("Апрель"),
                i18n("Май"),
                i18n("Июнь"),
                i18n("Июль"),
                i18n("Август"),
                i18n("Сентябрь"),
                i18n("Октябрь"),
                i18n("Ноябрь"),
                i18n("Декабрь"),
            ],
            modal_months: [
                i18n("Января"),
                i18n("Февраля"),
                i18n("Марта"),
                i18n("Апреля"),
                i18n("Мая"),
                i18n("Июня"),
                i18n("Июля"),
                i18n("Августа"),
                i18n("Сентября"),
                i18n("Октября"),
                i18n("Ноября"),
                i18n("Декабря"),
            ],
            week_days: [
                i18n("Воскресенье"),
                i18n("Понедельник"),
                i18n("Вторник"),
                i18n("Среда"),
                i18n("Четверг"),
                i18n("Пятница"),
                i18n("Суббота"),
            ],
            note: {
                type: '',
                title: '',
                content: '',
                start_date: '',
                end_date: '',
            },
        };
    },
    setup() {
        return {
            i18n,
            calendar,
            DATE,
            minusYear,
            plusYear,
            minusMonth,
            plusMonth,
            today,
            pushGlobal_note,
            deleteGlobal_note,
            editGlobal_note,
        };
    },
    computed: {
        everySeven() {
            let array = [];
            let sub_array = [];
            this.calendar.forEach((item, i) => {
                sub_array.push(item)
                if ((i + 1) % 7 == 0) {
                    array.push(sub_array)
                    sub_array = [];
                }
            });
            console.log(array);
            return array;
        },
    },
    methods: {
        hasUncheckedTasks(note) {
            if (note.type == 'task' && note.content.indexOf('ce0e172307d3 = ') != -1) {
                
                let tasks = note.content.slice(15, note.content.length)
                    .split(';')
                    .map(
                        task => ({
                            done: task.split(':')[0] === 'checked',
                            item: task.split(':')[1],
                        })
                    );

                console.log('tasks', tasks);

                return tasks.find(item => !item.done) === undefined
            }
            else {
                return false
            }
        },
        ymd(date) {
            return new Date(date).format("Y-m-d")
        },
        deleteNote(id) {
            this.togglePreview({});
            this.deleteGlobal_note(id);
        },
        updateNote(note, tasks_description) {
            console.log('tasks_description', tasks_description);
            if (tasks_description) {
                note.content = 'ce0e172307d3 = ' + tasks_description;
                console.log(note.content);
            }
            if (note.end_date == note.start_date) {
                return;
            }

            if (note) {
                this.note = note;
            }
            this.editGlobal_note(note);
            this.togglePreview(note)
        },
        editNote(note, tasks_description) {
            console.log('tasks_description', tasks_description);
            if (tasks_description) {
                note.content = 'ce0e172307d3 = ' + tasks_description;
                console.log(note.content);
            }
            if (note.end_date == note.start_date) {
                return;
            }

            if (note) {
                this.note = note;
            }
            this.editGlobal_note(note);
            this.toggleEdit(note)
        },
        toggleEdit(note) {
            this.modal_preview = false;
            if (note) {
                note.end_date = note.end_date.replace(' ', 'T');
                note.end_date = note.end_date.slice(0, note.end_date.length - 3);
                note.start_date = note.start_date.replace(' ', 'T');
                note.start_date = note.start_date.slice(0, note.start_date.length - 3);
                this.note = note;
            }
            this.edit_window = !this.edit_window;
            if (!this.edit_window) {
                this.note = {
                    type: '',
                    title: '',
                    content: '',
                    start_date: '',
                    end_date: '',
                }
            }
        },
        updateInput(stateName, key, value) {
            this[stateName][key] = value
        },
        leftOffset(start) {
            //return ((100 / 7) * (parseInt(new Date(start).format(`w`)) - 1))
            let period = ((100 / 7) * (parseInt(new Date(start).format(`w`)) - 1))
            let week_day = (100 / 7)
            let fill_minutes = (parseInt(new Date(start).format(`h`)) * 60) + parseInt(new Date(start).format(`i`))
            let free_time = (week_day / 1440) * fill_minutes
            return period + free_time
        },
        rightOffset(other) {
            if (parseInt(new Date(other.end_date).format(`w`)) < parseInt(new Date(other.start_date).format(`w`))) {
                return 0
            }
            let count = 6 < (parseInt(new Date(this.ymd(other.end_date)).valueOf() / 1000 / 60 / 60 / 24) - parseInt(new Date(this.ymd(other.start_date)).valueOf() / 1000 / 60 / 60 / 24)) ? 7 : parseInt(new Date(other.end_date).format(`w`));
            //return ((100 / 7) * (7 - count))
            let period = ((100 / 7) * (7 - count))
            let week_day = (100 / 7)
            let fill_minutes = (parseInt(new Date(other.end_date).format(`h`)) * 60) + parseInt(new Date(other.end_date).format(`i`))
            let free_time = (week_day / 1440) * (1440 - fill_minutes)
            return period + free_time
        },
        imgUrl(pet) {
            var images = require.context('@/assets/', false, /\.png$/)
            return images('./' + pet + ".png")
        },
        saveNotes(tasks_description) {
            console.log('tasks_description', tasks_description);
            if (tasks_description) {
                this.note.content = 'ce0e172307d3 = ' + tasks_description;
            }
            if (this.note.end_date == this.note.start_date) {
                return;
            }
            this.pushGlobal_note(this.note)
            this.toggleModal(this.current_week_day);
            this.note = {
                type: '',
                title: '',
                content: '',
                start_date: '',
                end_date: '',
            }
        },
        selectType(option) {
            this.note.type = option.img;
        },
        taskType(option) {
            this.note.task_type = option.img;
        },
        toggleModal(week_day = '') {
            this.note.start_date = new Date(week_day).format('Y-m-d') + 'T00:00';
            this.note.end_date = new Date(week_day).format('Y-m-d') + 'T23:59';
            console.log(this.note);
            this.note.title = '';
            this.note.content = '';
            this.modal_window = !this.modal_window;
            if (!this.modal_window) {
                this.note = {
                    type: '',
                    title: '',
                    content: '',
                    start_date: '',
                    end_date: '',
                }
            }
        },
        togglePreview(note) {
            this.note = note;
            this.modal_preview = !this.modal_preview;
        },
        getFullDate() {
            let getFullDate = [];
            getFullDate.push(this.week_days[new Date(this.note.start_date).getDay() ?? 0]);
            getFullDate.push(new Date(this.note.start_date).getDate());
            getFullDate.push(this.modal_months[new Date(this.note.start_date).getMonth() ?? 0]);
            getFullDate.push(new Date(this.note.start_date).getFullYear());

            return getFullDate.join(' ');
        },
    },
};
</script>
<!--<style scoped>
</style>-->

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    max-width: 1030px;
    margin: auto;
    margin-top: 15px;
    margin-bottom: 30px;
    display: flex;
}

* {
    padding: 0;
    margin: 0;
    border: 0;
}

.calendar-header span {
    width: 100%;
    text-align: center;
}

.calendar-header {
    height: 30px;
    border-bottom: 1px solid rgb(184, 184, 184);
    margin: 20px 15px 0 15px;
    padding-bottom: 10px;
}

.calendar-body {
    position: relative;
    overflow: hidden;

}

.calendar-body span {
    user-select: none;
    line-height: 1;
    width: 100%;
    min-height: 88px;
    /*padding: 9px;*/
    border-right: 1px solid rgb(184, 184, 184);
    border-bottom: 1px solid rgb(184, 184, 184);
    overflow-x: hidden;
}

.calendar-body span::-webkit-scrollbar {
    display: none;
}

.calendar-body span {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.date {
    margin: 9px 5px;
}

.date span {
    border: none;
}

.current-date .date span {
    background: #135de6;
    padding: 4px;
    color: white;
    border-radius: 25%;
}

.weekdays-off__color {
    color: #ff4a4a;
}

.calendar-body {
    border-left: 1px solid rgb(184, 184, 184);
    margin: 0 15px;
}

.switcher {
    border: 1px solid gray;
    border-radius: 15px;
    margin-left: 15px;
    overflow: hidden;
}

.today-border {
    border: 1px solid #135de6 !important;
}

.w-70 {
    padding: 0;
    min-width: 95px !important;
    justify-content: center;
}

.field {
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, .3);
    margin-bottom: 10px;
    padding: 0 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    padding-top: 7px;
    padding-bottom: 7px;
}

.ml-10 {
    margin-left: 10px !important;
}

.mb-10 {
    margin-bottom: 10px !important;
}

.mr-5 {
    margin-right: 5px !important;
}

.fz-13 {
    font-size: 13px;
}

.px-10 {
    padding: 0 10px !important;
}

.field:not(textarea.field) {
    height: 34px;
}

textarea.field::-webkit-scrollbar {
    line-height: 1.15;
}


.field>*:not(.field>*:last-child) {
    margin-right: 8px;
}

textarea.field:focus,
.field input:focus {
    outline: none;
}

.field input {
    width: 100%;
}

.field:focus-within {
    border-color: #135de6;
}

.field.error {
    border-color: #ff4a4a;
}

.field:focus-within .fa-tag {
    color: #135de6;
}

.rotate-y-180 {
    transform-origin: 50% 50%;
    font-size: 15px;
    color: #555555;
    transform: rotateY(180deg);
}

.fa-tag {
    height: 13px;
}

.today-p-10 {
    padding: 0 10px;
    height: 30px;
    display: flex;
    align-items: center;
    background: #135de6;
    color: white;
}

.bd-x-1 {
    user-select: none;
    border-right: 1px solid gray;
    border-left: 1px solid gray;
    padding: 0 10px;
    height: 30px;
    display: flex;
    align-items: center;
}

.circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
}

.title {
    margin-left: calc(15px + 10px);
    margin-right: auto;
    font-size: 36px;
}

.winter-color {
    background: #def1ff;
}

.winter-color-dark {
    background: #abdcff;
}

.modal-window__wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1;
}

.modal-window__body {
    width: 474px;
    margin: 23vh auto;
    background: white;
    border-radius: 3px;
    padding: 12px 17px 10px 17px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, .3);
    position: relative;
    overflow: hidden;
}

.save {
    background: #1ab394;
    width: 96px;
    height: 36px;
    border-radius: 40px;
    font-size: 12px;
}

button {
    color: white !important;
}

.modal-window__title {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 24px;
}

.modal-window__title small {
    user-select: none;
    display: flex;
    align-items: center;
    height: 20px;
    padding: 4px;
    border-radius: 3px;
    background: rgba(255, 230, 184, 1);
    margin-right: 20px;
    margin-left: auto;
}

.modal-close {
    color: #ff4a4a;
    font-size: 26px;
    cursor: pointer;
}

.task img,
.holiday img,
.note img {
    display: inline;
    margin: 0 2px 0 5px;
}

.note .dot {
    width: 10px;
    height: 10px;
    margin-right: 8px;
    border-radius: 50%;
    background: white;
}

.note {
    transition: .2s;
    margin-bottom: 3px;
    font-size: 13.5px;
    display: flex;
    align-items: center;
    height: 24px;
    border-radius: 3px;
    white-space: nowrap;
    color: white;
    border-radius: 5px;
    position: absolute;
    /*margin-left: 5px;
    margin-right: 5px;*/
    /*padding: 0 7px;*/
    overflow: hidden;
}

.notes:hover {
    background-color: rgb(179, 158, 120);
}

.notes {
    background: rgba(255, 230, 184, 1);
}

.line_notes_color {
    background: rgba(255, 230, 184, 1);
}

.holiday:hover {
    background: #16836d;
}

.holiday {
    background: #1ab394;
}

.line_holiday_color {
    background: #1ab394;
}

.task:hover {
    background: #6800bf;
}

.task.disabled:hover,
.task.disabled {
    /* background: #e5e7eb; */
    background: #d4d6da;
}

.task {
    background: #8b00ff;
}

.line_task_color.disabled {
    /* background: #e5e7eb; */
    background: #d4d6da;
}

.line_task_color {
    background: #8b00ff;
}

.line {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 5px;
}

.note-preview {
    padding: 13px 14px 14px 14px;
    width: 350px;
}

.note-preview .modal-window__title {
    margin-left: 0;
    margin-bottom: 8px !important;
}

.note-preview .modal-window__title small {
    margin-right: 0;
    font-size: 11px;
}

.note-preview .modal-window__title small span {
    margin: 0 5px;
    margin-bottom: 2.5px;
}

.note-preview textarea {
    font-size: 12px;
    width: 100%;
    height: 200px;
    overflow-y: auto;
    outline: none;
}

.note-preview textarea::-webkit-scrollbar {
    display: none;
}

.note-preview .actions {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 10px;
    font-size: 12px;
    padding: 0 20px;
    user-select: none;
}

.note-preview .action {
    cursor: pointer;
}

.note-preview .action.delete:hover {
    color: #ff4a4a;
}

.note-preview .action.edit:hover {
    color: rgb(136, 116, 78);
}

.note-preview .separator {
    height: 20px;
    width: .5px;
    background: #e5e7eb;
}
















.chbox_task {
    width: 16px;
    height: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 2px;
    margin-right: 10px;
    margin-top: 2.5px;
    position: relative;
}

.view .chbox_task i {
    font-size: 12px;
    position: absolute;
    top: .2px;
    color: white;
}

input:not(:checked)+.view .chbox_task i {
    display: none;
}

input:checked+.view .chbox_task {
    border: 2px solid #0079bf;
    background: #0079bf;
}

input:checked+.view ._task {
    text-decoration: line-through;
    color: rgb(0, 0, 0, .4);
}

.task-list {
    max-height: 280px;
    overflow: auto;
}

.task-list::-webkit-scrollbar {
    display: none;
}

._task {
    font-size: 14px;
    width: 100%;
    overflow: hidden;
    overflow-wrap: break-word;
    transition: .15s;
    /*resize: none;*/
}

._task:not(._task:focus) {
    max-height: 22px;
}

._task:focus {
    outline: none;
}

.add-task {
    max-height: 30px;
    font-size: 14px;
    margin: 10px 0;
}

.add-task * {
    padding: 2px 4px;
}

.add-task input:focus {
    outline: none;
}

.add-task input {
    width: 100%;
    margin-right: 8px;
    height: 30px !important;
}

.add-task button {
    color: white !important;
    background: #0079bf;
    border-radius: 2.5px;
    padding-left: 8px;
    padding-right: 8px;
    font-size: 12px;
}

.add-task button:focus {
    outline: none;
}

.add-task button.disabled {
    --tw-bg-opacity: 1;
    background-color: rgb(229 231 235 / var(--tw-bg-opacity));
}
</style>
