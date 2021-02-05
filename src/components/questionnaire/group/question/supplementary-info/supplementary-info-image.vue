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
            prepend-icon="mdi-camera"
            accept="image/*"
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
      <v-row
        v-if="selImage !== null"
        class="mb-6"
        no-gutters
        style="margin-bottom: 0"
      >
        <v-col />
        <v-col
          cols="10"
        >
          <v-img
            :src="selLink"
            lazy-src="https://miro.medium.com/max/875/1*m3XbxCsKakzXLv9Qmk2b_A.png"
            aspect-ratio="1"
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
          </v-img>
        </v-col>
        <v-col />
      </v-row>
      <v-row
        v-if="selImage !== null"
        class="mb-6"
        no-gutters
      >
        <v-col />
        <v-col
          cols="10"
        >
          <div
            class="pa-1 secondary text-no-wrap rounded-sm"
          >
            <v-list
              dense
            >
              <v-list-item>
                <v-list-item-content>
                  <div v-if="!speedDialOpen">
                    <v-list-item-subtitle>
                      Title: {{ selImage.title }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      Comment: {{ selImage.comment === '' ? 'N/A' : selImage.comment }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      Uploaded: {{ selImage.timeStamp }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      Exif Data: {{ getExifData(selLink) }}
                    </v-list-item-subtitle>
                  </div>
                  <div v-if="speedDialOpen">
                    <v-textarea
                      v-model="selImage.title"
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
                      v-model="selImage.comment"
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
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-model="speedDialOpen"
                        icon
                        :disabled="!imageNoteExist || readOnly"
                        v-bind="attrs"
                        v-on="on"
                        @click="speedDialOpen = !speedDialOpen"
                      >
                        <v-icon v-if="speedDialOpen">
                          mdi-close
                        </v-icon>
                        <v-icon v-else>
                          mdi-pencil
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Edit Title/Comment</span>
                  </v-tooltip>
                </v-list-item-icon>
                <v-list-item-icon>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :disabled="!imageNoteExist || readOnly"
                        icon
                        color="deep-orange"
                        v-bind="attrs"
                        v-on="on"
                        @click.stop="removeImage($event, selImage, galleryIndex); updateResponseStore();"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Delete File</span>
                  </v-tooltip>
                </v-list-item-icon>
                <v-list-item-icon>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :disabled="!imageNoteExist || readOnly"
                        icon
                        color="blue"
                        v-bind="attrs"
                        v-on="on"
                        @click.stop="downloadFile(selImage); updateResponseStore();"
                      >
                        <v-icon>mdi-download-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Download File</span>
                  </v-tooltip>
                </v-list-item-icon>
                <v-list-item-icon />
              </v-list-item>
            </v-list>
          </div>
        </v-col>
        <v-col />
      </v-row>
      <v-row>
        <v-col
          v-for="(image, index) in picture.value"
          :key="index"
          class="d-flex child-flex"
          cols="2"
        >
          <image-file
            :picture="image"
            @selected:image="setCurrentImage"
          />
        </v-col>
      </v-row>
      <v-input
        ref="validationInput"
        v-model="picture.value.length"
        :disabled="readOnly"
        :rules="rules"
        @update:error="onError"
      />
      <v-dialog
        v-model="confirmDialogOpen"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">
            {{ $t('app.questionnaire.group.question.deleteFileConf') }}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              text
              @click="confirmed()"
            >
              {{ $t('app.questionnaire.group.question.delete') }}
            </v-btn>

            <v-btn
              text
              @click="cancel()"
            >
              {{ $t('app.questionnaire.group.question.cancel') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>

/* eslint-disable no-undef */
import moment from 'moment'
import { MAX_IMAGE_UPLOADS_PER_ANSWER } from '../../../../../config.js'
import BaseMixin from '../../../../../mixins/base'
import AzureBlobService from '../../../../../services/azureBlobService'
import ImageFile from '../supplementary-info/image-file'
import EXIF from 'exif-js'

export default {
  components: {
    ImageFile
  },
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
      selImage: null,
      selLink: null,
      curImg: '',
      progressStatus: '',
      galleryIndex: 0,
      rules: [
        value => !this.picture.display || !this.picture.required ? true : this.picture.value.length > 0 || 'Required.'
      ],
      validationStatus: false,
      notification: null,
      speedDialOpen: false,
      confirmDialogOpen: false,
      confirmCallbackArgs: null
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
  mounted () {
    this.$watch(
      '$refs.validationInput.validations',
      (newValue) => {
        let error = this.displayPicture && this.isPictureRequired && !this.picture.value.length > 0
        this.onError(error)
      }
    )
  },
  methods: {
    setCurrentImage (imgLink, img) {
      this.selLink = imgLink
      this.selImage = img
    },
    getExifData (data) {
      // eslint-disable-next-line no-debugger
      debugger
      var image = new Image()
      image.src = data
      let d = EXIF.getAllTags(image)
      return d
    },
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

        this.picture.value.push({ isFileTypeImage: false, fileType: fileType, title: file.name, fileName: file.name, comment: 'N/A', timeStamp: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) })
        this.next()
        this.next()

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
        this.picture.value.push({ isFileTypeImage: true, fileType: 'image', title: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS), fileName: file.name, comment: '', timeStamp: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) })
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

    async removeImage ($event, file, index) {
      this.confirmDialogOpen = true
      this.confirmCallbackArgs = [$event, file, index]
    },

    async confirmed () {
      this.confirmDialogOpen = false

      let file = this.confirmCallbackArgs[1]
      let index = this.confirmCallbackArgs[2]

      try {
        await AzureBlobService.deleteFile(file)
      } catch (e) {
        console.log(e)
      } finally {
        this.picture.value.splice(index - 1, 1)
        this.prev()
        this.selImage = this.picture.value.length === 0 ? null : this.picture.value[0]
      }
    },

    cancel () {
      this.confirmDialogOpen = false
      let e = this.confirmCallbackArgs[0]
      e.stopPropagation()
    },

    changeImage (base64) {
      if (this.envProd) {
        this.picture.value[this.galleryIndex].base64String = base64
      } else {
        // this.images[this.galleryIndex].base64String = `data:image/jpeg;base64,${base64Images.image_002}`
        // this.picture.value[this.galleryIndex].base64String = `data:image/jpeg;base64,${base64Images.image_002}`
      }
    },

    setGalleryIndex () {
      this.galleryIndex = this.picture.value.length === 0
        ? 0
        : this.picture.value.length - 1
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
