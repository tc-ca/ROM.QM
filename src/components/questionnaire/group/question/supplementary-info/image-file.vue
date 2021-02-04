<template>
  <v-img
    :src="link"
    lazy-src="https://miro.medium.com/max/875/1*m3XbxCsKakzXLv9Qmk2b_A.png"
    aspect-ratio="1"
    class="grey lighten-2"
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
        <v-btn>See more info</v-btn>
      </v-overlay>
    </v-fade-transition>
  </v-img>
</template>

<script>

import AzureBlobService from '../../../../../services/azureBlobService'

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
      progressStatus: '',
      hover: false,
      galleryIndex: 0,
      validationStatus: false
    }
  },

  computed: { },

  created () {
    this.getLink()
  },
  mounted () { },
  methods: {
    async getLink () {
      // eslint-disable-next-line no-debugger
      debugger
      let response = await AzureBlobService.getImageFile(this.picture)
      console.log(response.data)
      this.link = response.data
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
