<template>
    <div class="modal-window__wrapper" @click="this.tasks = []; $emit('toggle-modal')" v-if="modal_window">
        <div class="modal-window__body" @click.stop>
            <div class="flex w-full">
                <v-select :options="options" :tabindex="0" class="select"
                    @input="(option) => { this.$emit('input-type', option) }"></v-select>
                <v-select v-if="note.type === 'task'" :has_img="false" style="width: 90px;margin-left: 10px"
                    :options="task_types" :tabindex="0" class="select"
                    @input="(task_type) => { this.$emit('task-type', task_type) }"></v-select>
                <div class="modal-window__title mb-10">
                    <small>{{ fullDate }}</small>
                    <div class="modal-close" @click="this.tasks = []; $emit('toggle-modal')">&times;</div>
                </div>
            </div>
            <div class="flex items-center mb-10 fz-13">
                <span>{{ i18n('от') }}</span>
                <label class="field ml-10 px-10 mb-0" :class="{
                    error: note.start_date == note.end_date
                }" style="width: 152px !important;">
                    <input type="datetime-local"
                        @input="$emit('update-input', 'note', 'start_date', $event.target.value)"
                        :value="note.start_date" />
                </label>
                <span class="ml-10">{{ i18n('до') }}</span>
                <label class="field ml-10 px-10 mb-0" :class="{
                    error: note.start_date == note.end_date
                }" style="width: 152px !important;">
                    <input type="datetime-local" @input="$emit('update-input', 'note', 'end_date', $event.target.value)"
                        :value="note.end_date" />
                </label>
            </div>
            <label class="field w-full" style="white-space: nowrap;" :class="{
                    error: !valid_fields.title
                }">
                <i class="fa-solid fa-tag rotate-y-180"></i>
                <input type="text" @input="$emit('update-input', 'note', 'title', $event.target.value)"
                    :value="note.title" :placeholder="i18n('Заголовок ...')" />
            </label>
            <div v-if="note.type === 'task' && note.task_type === 'items'">
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
                                <div class="modal-close close-task handle" :class="{
                                    gray: isOneItem
                                }"
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
                    }">Добавить</button>
                </div>
            </div>
            <textarea class="field w-full" v-else @input="$emit('update-input', 'note', 'content', $event.target.value)"
                :value="note.content" rows="5" :placeholder="i18n('Описание ...')"></textarea>
            <div class="btns flex justify-end">
                <button class="save select-none" :class="{
                    'text-gray-400 pointer-events-none bg-gray-200': note.start_date == note.end_date
                }" @click="save_note()">Сохранить</button>
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
    components: {
        vuedraggable: VueDraggableNext,
        VSelect,
    },
    props: {
        modal_window: {
            type: Boolean,
            required: true,
            default: false,
        },
        note: {
            type: Object,
            required: true,
        },
        fullDate: {
            type: String,
            required: true,
        },
        task_types: {
            type: Array,
            required: true,
        },
        options: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            tasks: [
                //{
                //    done: false,
                //    item: 'Создать интерфейс для парсера газет',
                //}
            ],
            task_item: '',
            valid_fields: {
                title: true,
                description: true,
            }
        }
    },
    methods: {
        save_note() {
            this.valid_fields.title = !!this.note.title;
            if (this.valid_fields.title) {
                this.$emit('save-note', this.getDescription())
            }
        },
        addTask() {
            if (this.task_item && !this.hasTask(this.task_item) && this.task_item.trim() != '') {
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
            this.tasks.forEach(task => {
                tasks_description.push(
                    (task.done ? 'checked' : 'unchecked') + ':' + task.item.trim()
                );
            });
            return tasks_description.join(';')
        },
    },
}
</script>

<style>
.chbox_task {
    width: 16px;
    min-width: 16px;
    height: 16px;
    min-height: 16px;
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
    left: .5px;
    color: white;
}

.chbox_task i:not(.chbox_task i.active) {
    display: none;
}

.chbox_task.active {
    border: 2px solid #0079bf;
    background: #0079bf;
}

._task.active {
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
.close-task {
    line-height: 1;
    margin-left: 8px;
    color: white !important;
    background: #ff4a4a;
    width: 20px;
    min-width: 20px;
    height: 20px;
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    border-radius: 2px;
}
</style>
