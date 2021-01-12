<template>
  <div>
    <v-autocomplete
      v-model="model"
      :items="items"
      :item-text="'text.' + lang"
      dense
      filled
      multiple
      :label="label"
      return-object
      @change="updateProvisionFilter"
    />
  </div>
</template>

<script>
import BaseMixin from '../../../mixins/base'
import _ from 'lodash'

import { mapState } from 'vuex'

export default {
  mixins: [BaseMixin],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      model: []
    }
  },
  computed: {
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
    }),
    unSelectedValues () {
      return _.difference(
        this.items,
        this.model)
    }
  },
  mounted () {

  },
  methods: {
    updateProvisionFilter () {
      let characteristicProvisions = []

      if (this.model.length > 0) {
        characteristicProvisions = this.model
      } else {
        characteristicProvisions = this.unSelectedValues
      }

      this.$store.dispatch('UpdateTagFilterState', { characteristicProvisions, characteristicCategory: 'MOC' })
    }
  }
}
</script>
