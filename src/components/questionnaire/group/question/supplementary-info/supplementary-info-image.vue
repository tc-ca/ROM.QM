<template>
  <v-expansion-panel v-show="displayPicture">
    <v-expansion-panel-header class="subtitle-2">
      <span>
        {{ label }}
        <span
          v-if="isPictureRequired"
          style="color: red"
        >(required)</span>
        <span v-else>(optional)</span>
      </span>
      <v-icon
        v-if="!validationStatus"
        color="red"
      >
        mdi-exclamation
      </v-icon>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
      <v-row>
        <v-col>
          <v-file-input
            prepend-icon="mdi-camera-plus-outline"
            hide-input
            @change="onFileChange"
          />
        </v-col>
        <v-col>
          <v-btn-toggle rounded>
            <v-btn
              v-model="speedDialOpen"
              fab
              :disabled="!imageNoteExist"
            >
              <v-icon v-if="speedDialOpen">
                mdi-close
              </v-icon>
              <v-icon v-else>
                mdi-pencil
              </v-icon>
            </v-btn>
            <!-- Delete Photo Button  -->

            <v-btn
              :disabled="!imageNoteExist"
              fab
              @click.stop="removeImage(galleryIndex); updateResponseStore();"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-card flat>
            <v-window v-model="galleryIndex">
              <!-- Gallery  -->
              <v-window-item
                v-for="(image, index) in images"
                :key="index"
              >
                <!-- Image -->
                <img
                  :src="image.base64String"
                  class="responsive-image center-image"
                  style="align-center"
                >
              </v-window-item>
            </v-window>
            <!-- Bubbles -->
            <v-card-actions
              v-if="images.length > 1 "
              class="justify-space-between"
            >
              <v-spacer />
              <v-row>
                <v-col>
                  <v-item-group
                    v-model="galleryIndex"
                    class="text-center"
                  >
                    <v-item
                      v-for="(image, index) in images"
                      :key="index"
                      v-slot="{ active, toggle }"
                    >
                      <v-btn
                        x-small
                        :input-value="active"
                        icon
                        @click="toggle"
                      >
                        <v-icon x-small>
                          mdi-record
                        </v-icon>
                      </v-btn>
                    </v-item>
                  </v-item-group>
                </v-col>
              </v-row>

              <v-spacer />
            </v-card-actions>
            <!-- Title and Comment -->

            <v-card-title
              v-if="imageNoteExist"
              class="subtitle-1"
            >
              <div class="text-truncate">
                {{ images[galleryIndex].title }}
              </div>
            </v-card-title>
            <v-card-subtitle v-if="imageNoteExist">
              <div class="text-no-wrap text-truncate">
                {{ images[galleryIndex].comment }}
              </div>
            </v-card-subtitle>

            <!-- Title and Comment inputs -->
            <v-card-text ref="title">
              <div v-if="speedDialOpen && imageNoteExist">
                <v-textarea
                  v-model="images[galleryIndex].title"
                  auto-grow
                  outlined
                  dense
                  rows="1"
                  label="Title"
                  @change="updateResponseStore()"
                />
                <v-textarea
                  v-model="images[galleryIndex].comment"
                  auto-grow
                  outlined
                  dense
                  placeholder=" "
                  rows="1"
                  label="Comment"
                  @change="updateResponseStore()"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-input
        ref="validationInput"
        v-model="images.length"
        :rules="rules"
        @update:error="onError"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>

/* eslint-disable no-undef */
import moment from 'moment'
import { MAX_IMAGE_UPLOADS_PER_ANSWER } from '../../../../../config.js'

export default {
  components: { },

  props: {
    picture: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    question: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    },
    saveToProp: {
      type: String,
      required: true
    }
  },

  data: function () {
    return {
      images: [],
      curImg: '',
      galleryIndex: 0,
      speedDialOpen: false,
      rules: [
        value => !this.picture.display || !this.picture.required ? true : this.images.length > 0 || 'Required.'
      ]
    }
  },

  computed: {
    imageNoteExist () {
      return this.images[this.galleryIndex] !== undefined
    },
    displayPicture () {
      return !this.picture.display
    },
    isPictureRequired () {
      return this.picture.option === '1'
    },
    validationStatus () {
      return !this.error
    }
  },
  mounted () {
    this.$watch(
      '$refs.validationInput.validations',
      (newValue) => {
        let error = this.picture.display && this.picture.required && !this.images.length > 0
        // console.log('$refs.validationInput.validations ' + error)
        this.onError(error)
      }
    )
  },
  methods: {
    onFileChange (e) {
      if (e.length === 0) {
        return
      }
      this.createImage(e)
      e = null
    },
    createImage (file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        vm.curImg = e.target.result
        this.addImageToArray()
      }
      reader.readAsDataURL(file)
    },

    addImageToArray () {
      if (this.images.length < MAX_IMAGE_UPLOADS_PER_ANSWER) {
        this.images.push({ base64String: this.curImg, title: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS), comment: '', timeStamp: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) })
        // this.images.push(base64)
        this.next()
      } else {
        // TODO: add string to resource of some kind.
        this.$store.dispatch('notification/show', { text: `Only ${MAX_IMAGE_UPLOADS_PER_ANSWER} pictures can be added to an answer`, color: 'error' })
      }
    },

    removeImage (index) {
      this.images.splice(index, 1)
      // need to jump forward twice (to move forward once) as the array has been altered.
      this.next()
      this.next()
    },

    changeImage (base64) {
      if (process.env.NODE_ENV === 'production') {
        this.images[this.galleryIndex].base64String = base64
      } else {
        this.images[this.galleryIndex].base64String = `data:image/jpeg;base64,${base64Images.image_002}`
      }
    },

    next () {
      this.galleryIndex = this.galleryIndex + 1 === this.images.length
        ? 0
        : this.galleryIndex + 1
    },

    prev () {
      this.galleryIndex = this.galleryIndex - 1 < 0
        ? this.images.length - 1
        : this.galleryIndex - 1
    },

    updateResponseStore: function () {
      const question = this.question
      const group = this.group
      const saveToProp = this.saveToProp
      const response = this.images
      this.$store.dispatch('updateSupplementaryInfo', { saveToProp, group, question, response })
    },
    onError (error) {
      this.$emit('error', error)
    }
  }

}

</script>

<style scoped>
.v-expansion-panel-header {
  padding-left: 4px !important;
}
.responsive-image {
  max-width: 100%;
  height: auto;
}
.center-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.v-card__text {
  padding: 0px !important;
  margin: 0px !important;
}

.v-card__title {
  padding: 8px 16px !important;
}

.v-card__subtitle {
  padding: 16px 16px 8px 16px !important;
}
</style>
