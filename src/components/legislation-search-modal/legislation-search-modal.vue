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
let mockData = null

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
      return this.legislations.map(legislation => {
        const description = `${legislation.LegislationReference} ${legislation.LegislationTextEnglish}`
        return Object.assign({}, legislation, { description })
      })
    }
  },

  created: function () {
    mockData = JSON.parse(require('../../api/legislation.json'))
    this.legislations = mockData.default.data
  },

  methods: {
    hideModal () {
      this.$emit('hideModal')
    }
  }
}
</script>

<style>

</style>
