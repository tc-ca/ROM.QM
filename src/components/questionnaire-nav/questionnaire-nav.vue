<template>
  <v-navigation-drawer
    v-model="isVisible"
    :width="300"
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
          class="truncated"
          @click="$emit('question:click', props.item)"
        >
          <div>
            <v-icon
              small
              color="primary"
            >
              mdi-flash-circle
            </v-icon>
            {{ props.item.name }}
          </div>
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
.truncated div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    padding: .5em;

    width: auto;
    max-width: 90%;
    -webkit-transition: max-width linear .5s;
    transition: max-width linear .5s;
  }
  .truncated:hover div {
    overflow: visible;
    white-space: normal;
    -ms-word-break: break-all;
    cursor: pointer;
    word-break: break-all;
    /* Non standard for webkit*/
      word-break: break-word;

  -webkit-hyphens: auto;
    -moz-hyphens: auto;
          hyphens: auto;

    max-width: 100%;
    width: 100%;
    z-index: 1; /* stack above subsequent cells */
  }
  .truncated:hover div:before {
    background-color: #d3e9f1ef;
    border: 1px solid #ddd;
    content: "";
    height: 100%;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    border-radius: 5px;
    position: absolute;
    z-index:-1; /* stack below truncated text */
  }
.v-treeview--dense .v-treeview-node__root {
  overflow: auto;
  min-height: 1px !important;
}
</style>
