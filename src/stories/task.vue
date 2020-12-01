<!--src/components/Task.vue-->
<template>
  <div :class="taskClass">
    <v-btn
      tile
      color="success"
    >
      <v-icon left>
        mdi-pencil
      </v-icon>
      Edit
    </v-btn>    <label class="checkbox">
      <input
        type="checkbox"
        :checked="isChecked"
        :disabled="true"
        name="checked"
      >
      <span
        class="checkbox-custom"
        @click="$emit('archiveTask', task.id)"
      />
    </label>
    <div class="title">
      <input
        type="text"
        :readonly="true"
        :value="this.task.title"
        placeholder="Input title"
      >
    </div>
    <div class="actions">
      <a
        v-if="!isChecked"
        @click="$emit('pinTask', task.id)"
      >
        <span class="icon-star" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Task',
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        state: '',
        title: ''
      })
    }
  },
  computed: {
    taskClass () {
      return `list-item ${this.task.state}`
    },
    isChecked () {
      return this.task.state === 'TASK_ARCHIVED'
    }
  }
}
</script>
