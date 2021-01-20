<template>
  <v-navigation-drawer
    v-model="isVisible"
    :width="280"
    absolute
    temporary
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Questionnaire Navigation
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />
    <v-treeview
      dense
      open-all
      :items="navitems"
    >
      <template
        slot="label"
        slot-scope="props"
      >
        <div
          class="actionLink"
          @click="$emit('question:click', props.item)"
        >
          <v-icon
            small
            color="primary"
          >
            mdi-flash-circle
          </v-icon>
          {{ props.item.name }}
        </div>
      </template>
    </v-treeview>
  </v-navigation-drawer>
</template>

<script>
// import _ from 'lodash'
export default {
  props: {
    display: {
      type: Boolean,
      default: false,
      required: true
    },
    navitems: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      drawer: null
    }
  },
  computed: {
    isVisible: {
      get () { return this.display },
      set (value) {
        if (!value) this.$emit('navigation-close', value)
      }
    }
  }
}
</script>

<style scoped>
.actionLink:hover {
  color: crimson;
  cursor:pointer;
  /* text-decoration: underline; */
}
.v-treeview--dense .v-treeview-node__root {
  overflow: auto;
  min-height: 1px !important;
}
</style>
