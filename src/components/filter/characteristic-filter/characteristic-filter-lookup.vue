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
  events: ['update-displayed-tags', 'mounted'],
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
    },
    updateFilter: {
      type: Boolean,
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
        const itemIds = this.myItems.map(x => x.id)
        return this.myValues.filter(value => itemIds.includes(value.id))
      },
      set (val) {
        // get the orginal values minus the ones we just took out
        // and the add the new model to it
        // return a unique list
        let list = _.differenceBy(this.values, this.model, 'id')
        list = list.concat(val)
        list = onlyUniqueObj(list, 'id')
        this.myValues = list

        this.$emit('update-displayed-tags', list)
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
      // todo performance update, include conditional to run if value matches parent
      this.updateProvisionFilter()
    },
    updateFilter (value, oldValue) {
      if (value) {
        // on intial load set orginal state without any specific charactertics/tags being set/applied (we need this "bucket of tags" to refer to it in the future i.e. check if question is taggable or not)
        this.updateProvisionFilter({ setOrginalTagFilterState: true })
      }
    }
  },
  mounted () {
    this.$emit('mounted', true)
  },
  methods: {
    updateProvisionFilter ({ setOrginalTagFilterState } = {}) {
      let characteristicProvisions = []

      if (this.model.length > 0) {
        characteristicProvisions = this.model
      } else {
        characteristicProvisions = this.unSelectedValues
      }
      // todo: remove this.label should be set to something else from the incoming data
      this.$store.dispatch('UpdateTagFilterState', { allTags: { setItems: setOrginalTagFilterState, items: this.items }, characteristicProvisions, characteristicCategory: this.label })
    }
  }
}
</script>
