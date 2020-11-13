<template>
  <div>
    <v-col
      class="d-flex"
      cols="12"
      sm="6"
    />
    <v-card flat>
      <v-card-title class="error--text">
        Regulation Violation
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="violations"
          :items="items"
          outlined
          filled
          chips
          color="blue-grey lighten-2"
          label="Select"
          item-text="description"
          item-value="LegislationReference"
          multiple
          hide-selected
          attach
        >
          <template #selection="data">
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  close
                  @click="data.select"
                  @click:close="remove(data.item)"
                  v-on="on"
                >
                  {{ data.item.LegislationReference }}
                </v-chip>
              </template>
              <span> {{ data.item.LegislationTextEnglish }}</span>
            </v-tooltip>
          </template>
          <template #item="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-item-content v-text="data.item" />
            </template>
            <template v-else>
              <v-row>
                <v-col>
                  <h3
                    class="subtitle-2 font-weight-regular"
                    style="color: orangered"
                  >
                    {{ data.item.LegislationReference }}
                  </h3>
                  <p class="subtitle-2 font-weight-regular">
                    {{ data.item.LegislationTextEnglish }}
                  </p>
                </v-col>
              </v-row>
            </template>
          </template>
        </v-select>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto">
      <!-- <v-card-text>
        <v-treeview
          selectable

          :items="items2"
          item-key="Label"
          :search="search"
          :filter="filter"
          :open.sync="open"
          :active="active"
        >
          <template v-slot:append="{ item }">
            <v-btn icon>
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
          </template>
          <template v-slot:label="{ item }">
            <a
              class=""
              @click="openDialog(item)"
            >{{ item.Label }} {{ item.Text }}</a>
          </template>
        </v-treeview>
      </v-card-text> -->
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
      descriptionLimit: 100
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
      return this.legislations.map(legislation => {
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
        let test = this.findObjectByLabel(entry, 'Text')
        // console.log(test)
        return Object.assign({}, test, { Description })
      })
    },
    autocompleteMenuProps () {
      // default properties copied from the vuetify-autocomplete docs
      let defaultProps = {
        closeOnClick: false,
        closeOnContentClick: true,
        disableKeys: true,
        openOnClick: false
        // offsetY: true

        // maxHeight: 304,
        // top: false
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
    // filter (item, queryText, itemText) {
    //   const textOne = item.name.toLowerCase()
    //   const textTwo = item.abbr.toLowerCase()
    //   const searchText = queryText.toLowerCase()

    //   return textOne.indexOf(searchText) > -1 ||
    //       textTwo.indexOf(searchText) > -1
    // }
  },

  created: function () {
    this.legislations = require('../../../../../api/legislation-flat-list.js').default.data
    this.legislations2 = require('../../../../../api/legislation-hierarchy-list.js').default.data[0].children.filter(
      function (x) {
        if (x.Label.trim() === '1.16') {
          return x.children
        }
      }
    )
  },
  methods: {
    remove (item) {
      const index = this.violations.indexOf(item.LegislationReference)
      if (index >= 0) this.violations.splice(index, 1)
    },
    findObjectByLabel (obj, label) {
      for (var i in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, i) && i === label) {
          const newText =
            obj[i].length > this.descriptionLimit
              ? obj[i].slice(0, this.descriptionLimit) + '...'
              : obj[i]
          obj[i] = newText
        }
        if (Object.prototype.hasOwnProperty.call(obj, i) && i === 'children') {
          for (let index = 0; index < obj[i].length; index++) {
            this.findObjectByLabel(obj[i][index], label)
          }
        }
      }
      return obj
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
