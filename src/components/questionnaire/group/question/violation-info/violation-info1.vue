<template>
  <div>
    <v-col
      class="d-flex"
      cols="12"
      sm="6"
    />
    <v-sheet class="pa-4">
      <v-text-field
        label="Search"
        outlined
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      />
    </v-sheet>
    <v-card class="mx-auto">
      <v-card-text>
        <v-treeview
          selectable
          :items="items"
          item-text="Text"
          item-key="Label"
          :search="search"
          :filter="filter"
          :open.sync="open"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      violations: null,
      legislations: [],
      legislations2: [],
      open: [1, 2],
      search: null,
      caseSensitive: false,
      active: null,
      descriptionLimit: 100,
      found: false,
      myobj: []
    }
  },
  computed: {
    fields () {
      if (!this.violations) return []
      return Object.keys(this.violations).map(key => {
        return {
          key,
          value: this.violations[key] || 'n/a'
        }
      })
    },
    items () {
      return this.legislations2.map(legislation => {
        const description = `${legislation.LegislationReference} ${legislation.LegislationTextEnglish}`
        return Object.assign({}, legislation, { description })
      })
    },
    items2 () {
      return this.legislations2.map(entry => {
        const Description =
          entry.Text.length > this.descriptionLimit
            ? entry.Text.slice(0, this.descriptionLimit) + '...'
            : entry.Text

        entry.text = Description
        this.findObjectByLabel(entry, '1.16')
        console.log('....')
        return Object.assign({}, this.myobj, { Description })
      })
    },
    autocompleteMenuProps () {
      // default properties copied from the vuetify-autocomplete docs
      let defaultProps = {
        closeOnClick: false,
        closeOnContentClick: true,
        disableKeys: true,
        openOnClick: false
      }

      if (this.$vuetify.breakpoint.smAndDown) {
        defaultProps.maxHeight = 200
        // defaultProps.top = true
      }
      return defaultProps
    },
    filter () {
      return this.caseSensitive
        ? function (item, search, textKey) {
          return item['children'].Label.trim().indexOf(search) > -1
        }
        : undefined
    }
  },

  created: function () {
    this.legislations = require('../../../../../api/legislation-flat-list.js').default.data
    var l = require('../../../../../api/legislation-hierarchy-list.js').default.data[0].children.filter(
      (x) => {
        if (x.Label.trim() === '1.16') {
          return x.children
        }
      }
    )
    this.findObjectByLabel(l[0], '1.16 (1) (d)')
    this.legislations2 = this.myobj
  },
  methods: {
    remove (item) {
      const index = this.violations.indexOf(item.LegislationReference)
      if (index >= 0) this.violations.splice(index, 1)
    },

    findObjectByLabel (obj, label) {
      for (var i in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, i) && i === 'Label') {
          if (obj[i].trim() === label) {
            let a = []
            this.found = true
            a.push(obj)
            this.myobj = a
            break
          }
        }
        if (Object.prototype.hasOwnProperty.call(obj, i) && i === 'children') {
          for (let index = 0; index < obj[i].length; index++) {
            if (this.found) {
              break
            }
            this.findObjectByLabel(obj[i][index], label)
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.v-card__title {
  border: none !important;
  margin-bottom: 10px!important;
}
*:not(.v-chip):not(.v-menu__content):not(.v-list-item):not(.v-select) {
  margin:0;
  padding:0;
}
</style>
