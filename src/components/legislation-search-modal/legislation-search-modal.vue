<template>
  <v-row justify="center">
    <v-dialog
      v-model="showModal"
      hide-overlay
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="hideModal()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Legislation Lookup</v-toolbar-title>
        </v-toolbar>
        <br>
        <v-card-text>
          <v-autocomplete
            v-model="legislationModel"
            filled=""
            rounded=""
            :items="items"
            color="primary"
            hide-no-data
            hide-selected
            item-text="description"
            item-value="id"
            placeholder="Start typing to Search"
            return-object
          />
        </v-card-text>
        <v-expand-transition>
          <v-list
            v-if="legislationModel"
          >
            <v-list-item
              v-for="(field, i) in fields"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title v-text="field.key" />
                <v-list-item-subtitle v-text="field.value" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expand-transition>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import { LANGUAGE } from '../../constants.js'

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true
    }

  },
  data () {
    return {
      legislationModel: null,
      legislations: []

    }
  },
  computed:
  {
    fields () {
      if (!this.legislationModel) return []

      return Object.keys(this.legislationModel).map(key => {
        return {
          key,
          value: this.legislationModel[key] || 'n/a'
        }
      })
    },
    items () {
      if (!this.legislations) {
        return []
      } else {
        return this.legislations.map(legislation => {
          let description = ''

          if (this.language === 'en') {
            description = `${legislation.Label} ${legislation.DisplayEnglishText}`
          } else {
            description = `${legislation.Label} ${legislation.DisplayFrenchText}`
          }

          return Object.assign({}, legislation, { description })
        })
      }
    },
    ...mapState({
      language: (state) => {
        if (state == null || !state.settings) {
          return LANGUAGE.ENGLISH
        }
        return state.settings.settings.lang
      }
    })
  },
  created: async function () {

  },
  // mounted () {
  //   // i want to listen for legislation being set
  //   this.$store.subscribe((mutation, state) => {
  //     switch (mutation.type) {
  //       case 'SetLegislations':
  //         console.log('legislation-search-model "SetLegislations"')

  //         this.legislations = this.$store.state.legislations.legislations
  //         break
  //       default:
  //         break
  //     }
  //   })
  // },

  methods: {
    hideModal () {
      this.$emit('hideModal')
    }
  }
}
</script>

<style>

</style>
