<template>
  <v-expansion-panel v-show="displayPicture">
    <v-expansion-panel-header class="subtitle-2">
      <span>
        {{ label }}
        <v-icon
          v-if="isPictureRequired"
          color="red"
          small
        >
          mdi-alpha-r-box-outline
        </v-icon>
        <v-icon
          v-else
          color="primary"
          small
        >
          mdi-alpha-o-box-outline
        </v-icon>
      </span>
      <v-spacer />
      <v-icon
        v-if="errorInPicture"
        color="red"
        small
      >
        mdi-message-alert
      </v-icon>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
      <v-row>
        <v-col>
          <v-file-input
            ref="fileUpload"
            prepend-icon="mdi-file-document-multiple"
            counter
            show-size
            :disabled="readOnly"
            @click="onFileUploadClick"
            @change="onFileChange"
          />
          <div>
            {{ progressStatus }}
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-list
            v-if="picture.value.length > 0"
            dense
          >
            <v-subheader>Uploaded Files</v-subheader>
            <v-list-item
              v-for="(image, index) in picture.value"
              :key="index"
            >
              <v-list-item-icon>
                <v-icon
                  size="30"
                >
                  mdi-file-{{ image.fileType }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <div v-if="!image.speedDialOpen">
                  <v-list-item-subtitle>
                    Title: {{ image.title }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Comment: {{ image.comment === '' ? 'N/A' : image.comment }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Uploaded: {{ image.timeStamp }}
                  </v-list-item-subtitle>
                </div>
                <div v-if="image.speedDialOpen">
                  <v-textarea
                    v-model="image.title"
                    auto-grow
                    outlined
                    :disabled="readOnly"
                    dense
                    rows="1"
                    label="Title"
                    style="font-size: small"
                    @change="updateResponseStore()"
                  />
                  <v-textarea
                    v-model="image.comment"
                    auto-grow
                    outlined
                    :disabled="readOnly"
                    dense
                    placeholder=" "
                    rows="1"
                    label="Comment"
                    style="font-size: small"
                    @change="updateResponseStore()"
                  />
                </div>
              </v-list-item-content>
              <v-list-item-icon>
                <v-btn
                  v-model="image.speedDialOpen"
                  icon
                  :disabled="!imageNoteExist || readOnly"
                  @click="image.speedDialOpen = !image.speedDialOpen"
                >
                  <v-icon v-if="image.speedDialOpen">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-list-item-icon>
              <v-list-item-icon>
                <v-btn
                  :disabled="!imageNoteExist || readOnly"
                  icon
                  color="deep-orange"
                  @click.stop="removeImage(image, galleryIndex); updateResponseStore();"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-icon>
              <v-list-item-icon>
                <v-btn
                  :disabled="!imageNoteExist || readOnly"
                  icon
                  color="blue"
                  @click.stop="downloadFile(image); updateResponseStore();"
                >
                  <v-icon>mdi-download-circle-outline</v-icon>
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-input
        ref="validationInput"
        v-model="picture.value.length"
        :disabled="readOnly"
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
import BaseMixin from '../../../../../mixins/base'
import AzureBlobService from '../../../../../services/azureBlobService'

export default {
  mixins: [BaseMixin],
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
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },

  data: function () {
    return {
      // images: [],
      curImg: '',
      progressStatus: '',
      galleryIndex: 0,
      // speedDialOpen: false,
      rules: [
        value => !this.picture.display || !this.picture.required ? true : this.picture.value.length > 0 || 'Required.'
      ],
      validationStatus: false,
      notification: null
    }
  },

  computed: {
    imageNoteExist () {
      return this.picture.value[this.galleryIndex] !== undefined
    },
    displayPicture () {
      return !this.picture.display
    },
    isPictureRequired () {
      return this.picture.option === 'required'
    },
    errorInPicture () {
      return this.displayPicture && this.isPictureRequired && !this.picture.value.length > 0
    }
  },
  watch: {
    speedDialOpen (value, oldValue) {
      console.log('Speed dial: ' + value)
    }
  },
  mounted () {
    this.$watch(
      '$refs.validationInput.validations',
      (newValue) => {
        let error = this.displayPicture && this.isPictureRequired && !this.picture.value.length > 0
        // console.log('$refs.validationInput.validations ' + error)
        this.onError(error)
      }
    )
  },
  methods: {
    onFileUploadClick (e) {
      // this.$refs.fileUpload.reset()
    },
    onFileChange (e) {
      if (!e) {
        return
      }
      this.createFile(e)
    },
    async createFile (file) {
      try {
        this.progressStatus = 'Uploading...'
        await AzureBlobService.uploadFile(file)
      } catch (e) {
        console.log(e)
      } finally {
        this.progressStatus = ''
        let fileType = ''
        if (file.type === 'application/pdf') fileType = 'pdf'
        else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') fileType = 'excel'
        else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') fileType = 'word'
        else if (file.type.startsWith('image')) fileType = 'image'
        else fileType = 'document-outline'

        this.picture.value.push({ isFileTypeImage: false, fileType: fileType, base64String: '', title: file.name, comment: 'N/A', timeStamp: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS), speedDialOpen: false })
        this.$refs.fileUpload.reset()
      }
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
      if (this.picture.value.length < MAX_IMAGE_UPLOADS_PER_ANSWER) {
        // This is temporary, until all the questions will come with the right data structure
        if (!Array.isArray(this.picture.value)) {
          this.picture.value = []
        }
        this.picture.value.push({ isFileTypeImage: true, fileType: '', base64String: this.curImg, title: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS), comment: '', timeStamp: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) })
        // this.images.push(base64)
        this.next()
      } else {
        // TODO: add string to resource of some kind.
        this.$store.dispatch('notification/show', { text: `Only ${MAX_IMAGE_UPLOADS_PER_ANSWER} pictures can be added to an answer`, color: 'error' })
      }
    },

    async downloadFile (file) {
      try {
        await AzureBlobService.downloadFile(file)
      } catch (e) {
        console.log(e)
      }
    },

    async removeImage (file, index) {
      try {
        // eslint-disable-next-line no-debugger
        debugger
        await AzureBlobService.deleteFile(file)
      } catch (e) {
        console.log(e)
      } finally {
        this.picture.value.splice(index, 1)
        // need to jump forward twice (to move forward once) as the array has been altered.
        this.next()
        this.next()
      }
    },

    changeImage (base64) {
      if (this.envProd) {
        this.picture.value[this.galleryIndex].base64String = base64
      } else {
        // this.images[this.galleryIndex].base64String = `data:image/jpeg;base64,${base64Images.image_002}`
        // this.picture.value[this.galleryIndex].base64String = `data:image/jpeg;base64,${base64Images.image_002}`
      }
    },

    next () {
      this.galleryIndex = this.galleryIndex + 1 === this.picture.value.length
        ? 0
        : this.galleryIndex + 1
    },

    prev () {
      this.galleryIndex = this.galleryIndex - 1 < 0
        ? this.picture.value.length - 1
        : this.galleryIndex - 1
    },

    updateResponseStore: function () {
      // Need to be changed because the updateSupplementaryInfo on the response store was deleted
      // const question = this.question
      // const group = this.group
      // const saveToProp = this.saveToProp
      // const response = this.images
      // this.$store.dispatch('updateSupplementaryInfo', { saveToProp, group, question, response })
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
