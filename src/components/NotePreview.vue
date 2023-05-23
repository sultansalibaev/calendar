<template>
    <div class="modal-window__wrapper" @click="this.tasks = [];$emit('toggle-preview', {})" v-if="modal_preview">
        <div class="modal-window__body note-preview" @click.stop>
            <div :class="'line line_' + note.type + '_color '+(hasUncheckedTasks ? 'disabled' : '')"></div>
            <h2 class="font font-bold">{{ note.title }}</h2>
            <div class="flex w-full">
                <div class="modal-window__title mb-10">
                    <small>{{ new Date(note.start_date).format('Y-m-d h:i') }} <span> - </span> {{ new Date(note.end_date).format('Y-m-d h:i') }}</small>
                </div>
            </div>
            <div v-if="isTaskList(note.content)">
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
                                <div class="modal-close close-task" :class="{
                                    gray: isOneItem
                                }" @click="removeItem(task.item)">×</div>
                                <div class="modal-close close-task handle" :class="{
                                    gray: isOneItem
                                }" style="font-size:18px;background: transparent;color:black !important;"><i class="fa-solid fa-grip-lines"></i></div>
                            </div>
                        </div>
                    </vuedraggable>
                </div>
            </div>
            <textarea disabled v-else :value="note.content" :placeholder="i18n('Описание ...')"></textarea>
            <hr>
            <div class="actions">
                <div class="action edit" v-if="tasksUpdated" @click="this.tasks = []; $emit('toggle-edit', note)">
                    <i class="fa-solid fa-pencil mr-5"></i>
                    {{ i18n('Изменить') }}
                </div>
                <div class="action edit" v-else @click="$emit('edit-note', note, getDescription())">
                    <i class="fa-solid fa-pencil mr-5"></i>
                    {{ i18n('Обновить') }}
                </div>
                <div class="separator"></div>
                <div class="action delete" @click="this.tasks = []; $emit('delete-note', note.id)"><i class="fa-solid fa-trash mr-5"></i>Удалить</div>
            </div>
        </div>
    </div>
</template>

<script>
import { VueDraggableNext } from "vue-draggable-next";
import i18n from '@/utils/i18n'
export default {
    setup() {
        return { i18n }
    },
    components: {
        vuedraggable: VueDraggableNext,
    },
    props: {
        note: {
            type: Object,
            required: true,
        },
        modal_preview: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            tasks: [],
            copy_tasks: [],
        }
    },
    methods: {
        isTaskList(content) {
            console.log('nu nixyia sibe');
            let bool = content.indexOf('ce0e172307d3 = ') != -1;

            if (bool && this.tasks.length == 0) {
                this.tasks = content.slice(15, content.length)
                    .split(';')
                    .map(
                        task => ({
                            done: task.split(':')[0] === 'checked',
                            item: task.split(':')[1],
                        })
                    )
                this.copy_tasks = content.slice(15, content.length)
                    .split(';')
                    .map(
                        task => ({
                            done: task.split(':')[0] === 'checked',
                            item: task.split(':')[1],
                        })
                    )
            }

            return bool;
        },
        removeItem(item) {
            if (this.isOneItem) return;
            this.tasks = this.tasks.filter(task => (task.item != item))
        },
        getDescription() {
            if (this.tasks.length == 0) {
                this.tasks = [];
                return false;
            }
            let tasks_description = [];
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
    computed: {
        tasksUpdated() {
            return JSON.stringify(this.copy_tasks) == JSON.stringify(this.tasks) || this.note.content.indexOf('ce0e172307d3 = ') == -1;
        },
        isOneItem() {
            return this.tasks.length === 1;
        },
        hasUncheckedTasks() {
            if (this.note.content.indexOf('ce0e172307d3 = ') == -1) {
                return false
            }
            return this.tasks.find(item => !item.done) === undefined
        }
    },
}
</script>

<style scoped>
.task-list {
    margin-bottom: 10px;
}
.close-task {
    margin-left: 8px;
    color: white !important;
    background: #ff4a4a;
    width: 20px;
    min-width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    border-radius: 2px;
    padding-top: 1.5px;
    user-select: none;
}
.close-task.gray {
    --tw-bg-opacity: 1;
    background-color: rgb(229 231 235 / var(--tw-bg-opacity));
}
</style>