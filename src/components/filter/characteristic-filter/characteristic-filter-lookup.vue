<template>
  <v-list-group>
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>{{ item.text[lang] }} ({{ count }})</v-list-item-title>
      </v-list-item-content>
    </template>
    <v-list-item>
      <v-list-item-content>
        <v-autocomplete
          v-model="model"
          :items="myItems"
          :item-text="'text.' + lang"
          item-value="id"
          chips
          deletable-chips
          dense
          filled
          multiple
          return-object
          @change="updateProvisionFilter"
        />
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script>
import BaseMixin from '../../../mixins/base'
import _ from 'lodash'
import { onlyUniqueObj } from '../../../utils'

import { mapState } from 'vuex'

export default {
  mixins: [BaseMixin],
  events: ['update-displayed-tags'],
  props: {
    item: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    values: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      myValues: this.values
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
    model: {
      get () {
        const itemIds = this.items.map(x => x.id)
        return this.myValues.filter(value => itemIds.includes(value.id))
      },
      set (val) {
        // this.myValues = val
        // get the orginal values minus the ones we just took out
        // and the add the new model to it
        // return a unique list

        let test = _.differenceBy(
          this.values,
          this.model, 'id')
        test = test.concat(val)
        test = onlyUniqueObj(test, 'id')
        console.log('sab', test)
        //
        this.myValues = test

        this.$emit('update-displayed-tags', test)
      }
    },
    myItems () {
      return this.items.length > 0 ? this.items : [this.item]
    },
    unSelectedValues () {
      return _.difference(
        this.items,
        this.model)
    },
    count () {
      return this.model.length
    }
  },
  watch:
  {
    values (value) {
      // console.log('todo implement')
      // this.updateProvisionFilter()
    }
  },
  mounted () {
    this.updateProvisionFilter()
  },
  methods: {
    updateProvisionFilter () {
      let characteristicProvisions = []

      if (this.model.length > 0) {
        characteristicProvisions = this.model
      } else {
        characteristicProvisions = this.unSelectedValues
      }
      // todo: remove this.label should be set to something else from the incoming data
      this.$store.dispatch('UpdateTagFilterState', { characteristicProvisions, characteristicCategory: this.label })
    }
  }
}
</script>
