<template>
  <v-navigation-drawer

    app
    right
    temporary
  >
    <v-list
      dense
      nav
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Site Filter
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>mdi-close</v-icon>
        </v-list-item-action>
      </v-list-item>
      <v-divider />
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>MOC Type</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content>
            <characteristic-filter-lookup
              :items="data.MOC"
              label="MOC Type"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-divider />
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Mode</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content>
            <characteristic-filter-lookup
              :items="data.Mode"
              label="Mode"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-divider />
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Class and Divisions</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content>
            <characteristic-filter-lookup
              :items="data.MOC"
              label="Class and Divisions"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-divider />
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>UN Numbers</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content>
            <characteristic-filter-lookup
              :items="data.MOC"
              label="UN Numbers"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-divider />
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>HOTI Type</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content>
            <characteristic-filter-lookup
              :items="data.MOC"
              label="HOTI Type"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import BaseMixin from '../../../mixins/base'
import CharacteristicFilterLookup from './characteristic-filter-lookup.vue'

import { mapState } from 'vuex'

export default {
  components: { CharacteristicFilterLookup },
  mixins: [BaseMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: {}
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
    })
  },
  async mounted () {
    this.data = await this.getCharacteristics()
  },
  methods: {
    async getCharacteristics (val) {
      const axios = await import('axios')

      let response = await axios.get('/static/characteristics.json')
        .catch(function (error) {
          // handle error
          console.log(error)
        })

      console.log(response)

      return response.data
    }
  }
}
</script>
