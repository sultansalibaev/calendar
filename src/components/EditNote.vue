<template>
    <div class="modal-window__wrapper" @click="this.tasks = []; $emit('toggle-edit')" v-if="edit_window">
        <div class="modal-window__body" @click.stop>
            <div class="flex w-full">
                <v-select :options="options" :tabindex="options.findIndex(opt => (opt.img === note.type))" class="select" @input="(option) => { this.$emit('input-type', option) }"></v-select>
                <v-select v-if="note.type === 'task'" :has_img="false" style="width: 90px;margin-left: 10px"
                    :options="task_types" :tabindex="isTaskList() ? 1 : 0" class="select"
                    @input="(task_type) => { this.$emit('task-type', task_type) }"></v-select>
                <div class="modal-window__title mb-10">
                    <small>{{ fullDate }}</small>
                    <div class="modal-close" @click="this.tasks = []; $emit('toggle-edit')">&times;</div>
                </div>
            </div>
            <div class="flex items-center mb-10 fz-13">
                <span>от</span>
                <label class="field ml-10 px-10 mb-0" :class="{
                    error: note.start_date == note.end_date
                }" style="width: 152px !important;">
                    <!--<i class="fa-solid fa-tag rotate-y-180"></i>-->
                    <input type="datetime-local" @input="$emit('update-input', 'note', 'start_date', $event.target.value)" :value="note.start_date" />
                </label>
                <span class="ml-10">до</span>
                <label class="field ml-10 px-10 mb-0" :class="{
                    error: note.start_date == note.end_date
                }" style="width: 152px !important;">
                    <!--<i class="fa-solid fa-tag rotate-y-180"></i>-->
                    <input type="datetime-local" @input="$emit('update-input', 'note', 'end_date', $event.target.value)" :value="note.end_date" />
                </label>
            </div>
            <label class="field w-full" style="white-space: nowrap;" :class="{
                    error: !valid_fields.title
                }">
                <i class="fa-solid fa-tag rotate-y-180"></i>
                <input type="text"  @input="$emit('update-input', 'note', 'title', $event.target.value)" :value="note.title" :placeholder="i18n('Заголовок ...')" />
            </label>
            <div v-if="note.type === 'task' && note.task_type == 'items'">
                <div class="task-list">
                    <vuedraggable group="todosapp" class="accs" :list="tasks" animation="250" handle=".handle">
                        <div v-for="(task, i) in tasks" :key="i">
                            <div class="view flex">
                                <label class="chbox_task" :class="{
                                    active: task.done
                                }">
                                    <input type="checkbox" class="hidden" v-model="task.done">
                                    <i class="fa fa-check" :class="{
                                        active: task.done
                                    }" aria-hidden="true"></i>
                                </label>
                                <textarea class="_task" :class="{
                                    active: task.done
                                }" v-model="task.item"></textarea>
                                <div class="modal-close close-task" @click="removeItem(task.item)">×</div>
                                <div class="modal-close close-task handle"
                                    style="font-size:18px;background: transparent;color:black !important;"><i class="fa-solid fa-grip-lines"></i></div>
                            </div>
                        </div>
                    </vuedraggable>
                </div>
                <div class="add-task flex">
                    <input type="text" class="field" @keydown.enter="addTask()" :class="{
                        error: hasTask(task_item)
                    }" v-model="task_item" :placeholder="i18n('Добавить задачу')">
                    <button @click="addTask()" :class="{
                        'disabled': hasTask(task_item)
                    }">{{ i18n('Добавить') }}</button>
                </div>
            </div>
            <textarea class="field w-full" v-else @input="$emit('update-input', 'note', 'content', $event.target.value)" :value="note.content" rows="5" :placeholder="i18n('Описание ...')"></textarea>
            <div class="btns flex justify-end">
                <button class="save select-none" :class="{
                    'text-gray-400 pointer-events-none bg-gray-200': note.start_date == note.end_date
                }" @click="edit_note()">{{ i18n('Изменить') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { VueDraggableNext } from "vue-draggable-next";
import VSelect from "@/components/UI/VSelect.vue";
import i18n from '@/utils/i18n'

export default {
    setup() {
        return { i18n }
    },
    props: {
        edit_window: {
            type: Boolean,
            required: true,
            default: false,
        },
        note: {
            type: Object,
            required: true,
        },
        options: {
            type: Array,
            required: true,
        },
        task_types: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
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
            tasks: [],
            task_item: '',
            valid_fields: {
                title: true,
                description: true,
            }
        }
    },
    //methods: {
    //    setSelected(option) {
    //        this.$emit('set-selected', option)
    //    },
    //},
    computed: {
        fullDate() {
            let fullDate = [];
            fullDate.push(this.week_days[new Date(this.note.start_date).getDay()]);
            fullDate.push(new Date(this.note.start_date).getDate());
            fullDate.push(this.modal_months[new Date(this.note.start_date).getMonth()]);
            fullDate.push(new Date(this.note.start_date).getFullYear());

            return fullDate.join(' ');
        },
    },
    methods: {
        edit_note() {
            this.valid_fields.title = !!this.note.title;
            if (this.valid_fields.title) {
                this.$emit('edit-note', this.note, this.getDescription())
            }
        },
        isTaskList() {
            console.log('nu nixyia sibe');
            let bool = this.note.content.indexOf('ce0e172307d3 = ') != -1;

            if (bool && this.tasks.length == 0) {
                this.tasks = this.note.content.slice(15, this.note.content.length)
                    .split(';')
                    .map(
                        task => ({
                            done: task.split(':')[0] === 'checked',
                            item: task.split(':')[1],
                        })
                    )
            }

            if (this.note.task_type == 'items' && this.note.type == 'task') {
                this.$emit('update-input', 'note', 'content', '')
                return false;
            }

            console.log('bool', bool);

            return bool;
        },
        addTask() {
            if (this.task_item && !this.hasTask(this.task_item)) {
                this.tasks.push(
                    {
                        done: false,
                        item: this.task_item.trim(),
                    }
                );
                this.task_item = ''
                document.querySelector('.add-task .field').focus()
            }
        },
        removeItem(item) {
            this.tasks = this.tasks.filter(task => (task.item != item))
        },
        hasTask(task_item) {
            return this.tasks.find(task => (task.item == task_item.trim())) != undefined || task_item.indexOf(':') != -1 || task_item.indexOf(';') != -1
        },
        getDescription() {
            if (this.tasks.length == 0 || this.note.type !== 'task' || this.note.task_type != 'items') {
                this.tasks = [];
                return false;
            }
            let tasks_description = [];
            console.log(this.tasks);
            this.tasks.forEach(task => {
                tasks_description.push(
                    (task.done ? 'checked' : 'unchecked') + ':' + task.item.trim()
                );
            });
            console.log(tasks_description);
            this.tasks = [];
            return tasks_description.join(';')
        },
    },
    components: {
        vuedraggable: VueDraggableNext,
        VSelect,
    },
}
</script>
