<template>
  <div>
    <v-text-field
      v-model="value"
      outlined
      filled
      dense
    />
  </div>
</template>

<script>

export default {

  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      value: null
    }
  }
}
</script>

<style>

</style>
