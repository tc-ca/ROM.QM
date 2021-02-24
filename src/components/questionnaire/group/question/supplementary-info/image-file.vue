<template>
  <div
    class="rounded-lg"
  >
    <v-img
      :src="link"
      lazy-src="https://miro.medium.com/max/875/1*m3XbxCsKakzXLv9Qmk2b_A.png"
      aspect-ratio="1"
      class="grey lighten-2"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          />
        </v-row>
      </template>
      <v-fade-transition>
        <v-overlay
          v-if="hover"
          absolute
          color="#036358"
        >
          <v-btn
            @click="$emit('selected:image', link, picture)"
          >
            See More
          </v-btn>
        </v-overlay>
      </v-fade-transition>
    </v-img>
  </div>
</template>

<script>

import mime from 'mime-types'
export default {
  props: {
    picture: {
      type: Object,
      required: true
    }
  },

  data: function () {
    return {
      link: '',
      curImg: '',
      hover: false,
      validationStatus: false
    }
  },

  computed: { },

  created () {
    this.getLink()
  },
  mounted () {
    this.$store.watch(
      state => state.imagefile.imageData.imageDetails,
      (value) => {
        if (value) {
          this.getImageData()
        }
      }
    )
    this.$store.watch(
      state => state.imagefile.deletedImageData.imageDetails,
      (value) => {
        if (value) {
          this.getImageData()
        }
      }
    )
  },
  methods: {
    getImageData () {
      let storeObj = this.$store.state.imagefile.imageData.imageDetails
      if (storeObj !== null) {
        // let element = stroeObj.find(s => s.guid === this.picture.guid)
        if (storeObj.guid === this.picture.guid) {
          this.link = `data:${mime.lookup(this.picture.fileName)};base64,${storeObj.result}`
        }
      }
    },
    async getLink () {
      let event = new CustomEvent('tdg-qstnnr-downloadBlobImage', {
        detail: {
          nameGuid: this.picture.guid,
          fileName: this.picture.fileName
        },
        bubbles: true,
        cancelable: true
      })
      document.body.dispatchEvent(event)
    },

    onError (error) {
      this.picture.validationStatus = !error
      if (!this.picture.validationStatus) {
        this.picture.notification = { header: `Question: ${this.question.text[this.lang]}`, text: `Picture is required on this question, please upload at least one.`, color: 'error' }
      } else {
        this.picture.notification = null
      }
      this.$emit('error', error)
    }
  }

}
</script>
