<template>
  <v-card
    class="mx-auto"
  >
    <v-sheet class="pa-4">
      <v-text-field
        v-model="searchInput"
        :label="$t('app.builder.responseOptions.provisions.search')"
        outlined
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      />
    </v-sheet>
    <v-card-text>
      <v-treeview
        v-model="option.provisions"
        selectable
        item-key="id"
        :item-text="displayTextLang"
        selection-type="leaf"
        :search="searchInput"
        :items="provisions"
        @input="emitUpdateSearchableProvisionsEvent()"
      >
        <template v-slot:label="{ item }">
          <div class="truncated">
            <div>{{ lang === eng ? item.DisplayEnglishText : item.DisplayFrenchText }}</div>
          </div>
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>

import { LANGUAGE } from '../../constants.js'
import { mapState } from 'vuex'

export default {
  emits: ['update-searchable-provisions'],
  props: {
    option: {
      type: Object,
      required: true
    },
    provisions: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      searchInput: null
    }
  },
  computed: {
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return LANGUAGE.ENGLISH
        }
        return state.settings.settings.lang
      }
    }),
    displayTextLang () {
      return (this.lang === this.eng) ? 'DisplayEnglishText' : 'DisplayFrenchText'
    },
    eng () {
      return LANGUAGE.ENGLISH
    }
  },
  methods: {
    emitUpdateSearchableProvisionsEvent () {
      this.$emit('update-searchable-provisions')
    }
  }

}
</script>

<style scoped>
</style>
