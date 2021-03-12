<template>
  <div>
    <input
      :id="id"
      v-model="radioButtonValue"
      type="radio"
      :name="name"
      :value="label"
    >
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    radioButtonValue: {
      get: function () {
        return this.value
      },
      set: function () {
        // Communicate the change to parent component so that selectedValue can be updated
        this.$emit('change', this.label)
      }
    }
  }

}
</script>

<style scoped>

</style>
