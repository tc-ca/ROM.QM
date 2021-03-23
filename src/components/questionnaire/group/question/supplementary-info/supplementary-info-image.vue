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
        mdi-exclamation
      </v-icon>
    </v-expansion-panel-header>
    <v-expansion-panel-content
      eager
    >
      <v-row>
        <v-col>
          <v-file-input
            ref="fileUpload"
            prepend-icon="mdi-camera"
            accept="image/*"
            counter
            multiple
            show-size
            :disabled="readOnly"
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
      >
        <v-col />
        <v-col
          cols="10"
        >
          <v-card
            class="mx-auto my-12"
            max-width="474"
          >
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              />
            </template>
            <v-img
              style="text-align: center"
              :src="selLink"
              lazy-src="https://miro.medium.com/max/875/1*m3XbxCsKakzXLv9Qmk2b_A.png"
            />

            <v-card-text
              v-if="!speedDialOpen"
              style="padding: 30px"
            >
              <v-row
                align="center"
                class="mx-0"
              >
                <div
                  style="font-size: 20px; font-weight: bold; padding-top: 20px; padding-left: 10px"
                >
                  {{ selImage.title }}
                </div>
              </v-row>
              <v-row
                align="center"
                class="mx-0"
              >
                <div
                  class="grey--text"
                  style="padding-left: 10px"
                >
                  Comment: {{ selImage.comment }}
                </div>
              </v-row>
              <v-row
                align="center"
                class="mx-0"
              >
                <div
                  class="grey--text"
                  style="padding-left: 10px"
                >
                  Uploaded by: {{ selImage.uploadedBy }}
                </div>
              </v-row>
              <v-row
                align="center"
                class="mx-0"
              >
                <div
                  class="grey--text"
                  style="padding-left: 10px"
                >
                  Uploaded on: {{ selImage.timeStamp }}
                </div>
              </v-row>

              <div class="my-4 subtitle-1">
                <!-- Last updated: {{ selImage.timeStamp }} -->
              </div>
            </v-card-text>
            <div
              v-if="speedDialOpen"
              style="padding: 20px"
            >
              <v-textarea
                v-model="selImage.title"
                auto-grow
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
                :disabled="readOnly"
                dense
                placeholder=" "
                rows="1"
                label="Comment"
                style="font-size: small"
                @change="updateResponseStore()"
              />
            </div>
            <v-divider class="mx-4" />
            <v-card-text>
              <v-chip-group
                active-class="deep-purple accent-4 white--text"
                column
              >
                <div
                  style="padding-left: 10px; font-weight: bold;"
                >
                  Exif Data:
                </div>
                <div
                  v-if="isExifDataAvailable"
                  style="padding-left: 1px; height: 150px; overflow: auto"
                >
                  <li
                    v-for="(value, propertyName, index) in selExifData"
                    :key="index"
                  >
                    {{ propertyName }}: {{ value }}
                  </li>
                </div>
                <div
                  v-else
                  style="padding-left: 5px; color: red"
                >
                  No Data available
                </div>
              </v-chip-group>
            </v-card-text>
            <v-divider class="mx-4" />
            <div
              style="text-align: center"
            >
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
              <v-list-item-icon
                style="margin-left: 30px; margin-top: 10px; margin-bottom: 10px"
              >
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
            </div>
          </v-card>
        </v-col>
        <v-col />
      </v-row>
      <v-row>
        <v-col
          v-for="image in curPageImages"
          :key="image.guid"
          class="d-flex child-flex"
          cols="2"
        >
          <image-file
            :picture="image"
            @selected:image="setCurrentImage"
          />
        </v-col>
      </v-row>
      <v-row v-if="question.result && question.result.pictures && question.result.pictures.items && question.result.pictures.items.length > 0">
        <v-col
          class="d-flex child-flex"
          cols="12"
        >
          <v-pagination
            v-model="page"
            :length="calculateTotalPages(question.result.pictures.items.length)"
            :total-visible="5"
            circle
            @input="onNextPageMove($event)"
          />
        </v-col>
      </v-row>
      <v-input
        v-if="question.result && question.result.pictures && question.result.pictures.items"
        ref="validationInput"
        v-model="question.result.pictures.items.length"
        :disabled="readOnly"
        :rules="rules"
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
import { mapState } from 'vuex'
// import { MAX_IMAGE_UPLOADS_PER_ANSWER } from '../../../../../config.js'
import BaseMixin from '../../../../../mixins/base'
import ImageFile from '../supplementary-info/image-file'
import EXIF from 'exif-js'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    ImageFile
  },
  mixins: [BaseMixin],
  props: {
    pictureRequirement: {
      type: String,
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
      page: 1,
      selImage: null,
      selLink: null,
      selExifData: '',
      curImg: '',
      curPage: 0,
      curPageImages: [],
      isExifDataAvailable: false,
      progressStatus: '',
      galleryIndex: 0,
      rules: [
        value => !this.display || !this.isPictureRequired === 'required' ? true : (this.question.result.pictures != null && this.question.result.pictures.items.length > 0) || 'Required.'
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
      return this.question.result.pictures.items[this.galleryIndex] !== undefined
    },
    displayPicture () {
      return this.pictureRequirement !== 'n/a'
    },
    isPictureRequired () {
      return this.pictureRequirement === 'required'
    },
    errorInPicture () {
      return this.displayPicture && this.isPictureRequired && this.question.result.pictures && this.question.result.pictures.items && !this.question.result.pictures.items.length > 0
    },
    ...mapState({
      userName: state => {
        if (!state || !state.settings) {
          return 'N/A'
        }
        return state.settings.settings.userName
      }
    })
  },

  mounted () {
    this.$store.watch(
      state => state.imagefile.imageFileNotification.imageResults,
      (value) => {
        if (value) {
          this.onUploadImage()
        }
      }
    )
    this.$store.watch(
      state => state.imagefile.deletedImageData.imageDetails,
      (value) => {
        if (value) {
          this.onDeleteImage()
        }
      }
    )
    this.onNextPageMove(1)
  },
  methods: {
    onUploadImage () {
      let el = this.$store.state.imagefile.imageFileNotification.imageResults
      if (el !== null) {
        // storeObj.forEach((el, index) => {
        if (this.question.result.pictures == null) {
          this.question.result.pictures = {}
          this.question.result.pictures.items = []
        }
        if (this.question.guid === el.qguid && !this.question.result.pictures.items.some(p => p.guid === el.guid)) {
          this.question.result.pictures.items.push({
            title: el.result,
            fileName: el.result,
            comment: 'N/A',
            guid: el.guid,
            uploadedBy: this.userName,
            timeStamp: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)
          })
          this.progressStatus = ''
          this.curPage = this.calculateTotalPages(this.question.result.pictures.items.length)
          this.onNextPageMove(this.curPage)
          this.next()
          this.next()
        }
        // })
      }
    },

    onDeleteImage () {
      let el = this.$store.state.imagefile.deletedImageData.imageDetails
      if (el !== null) {
        // storeDelObj.forEach((el, index) => {
        if (this.question.result.pictures.items.some(p => p.guid === el.guid)) {
          this.question.result.pictures.items.splice(this.question.result.pictures.items.findIndex(p => p.guid === el.guid), 1)
          this.prev()
          this.prev()
          this.selImage = null
          this.onNextPageMove(this.curPage)
        }
        // })
      }
    },
    calculateTotalPages (n) {
      let x = n % IMAGES_PER_PAGE === 0 ? Math.floor(n / IMAGES_PER_PAGE) : Math.floor(n / IMAGES_PER_PAGE) + 1
      return x
    },

    onNextPageMove (i) {
      let start = i === 1 ? 0 : ((i - 1) * IMAGES_PER_PAGE)
      let end = (i * IMAGES_PER_PAGE)
      this.curPage = i
      this.curPageImages = null
      this.curPageImages = (this.question.result.pictures && this.question.result.pictures.items) ? this.question.result.pictures.items.slice(start, end) : null
    },

    setCurrentImage (imgLink, img) {
      this.selLink = imgLink
      this.selImage = img
      this.getExifData(imgLink)
    },

    getExifData (data) {
      let image = new Image()
      image.src = data
      let exifData = null
      EXIF.getData(image, function () {
        exifData = EXIF.getAllTags(this)
      })
      this.isExifDataAvailable = (exifData != null && Object.keys(exifData).length > 0)
      this.selExifData = exifData
    },

    onFileChange (e) {
      if (!e) {
        return
      }

      e.forEach(f => {
        var reader = new FileReader()
        reader.onload = (r) => {
          this.createFile(f.name, r.target.result.split(',')[1])
        }
        reader.readAsDataURL(f)
      })
    },

    async createFile (fileName, file) {
      this.progressStatus = 'Uploading...'
      let guid = uuidv4()
      let fName = fileName
      let str = file

      try {
        let event = new CustomEvent('tdg-qstnnr-uploadBlobImage', {
          detail: {
            base64String: str,
            qguid: this.question.guid,
            nameGuid: guid,
            fileName: fName,
            isFileTypeImage: true
          },
          bubbles: true,
          cancelable: true
        })
        document.body.dispatchEvent(event)
      } catch (e) {
        console.log(e)
      } finally {
        this.$refs.fileUpload.reset()
      }
    },

    async downloadFile (file) {
      var link = document.createElement('a')
      link.href = this.selLink
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        document.body.removeChild(link)
        window.URL.revokeObjectURL(e.target.result)
      }, 100)
    },

    async removeImage ($event, file, index) {
      this.confirmDialogOpen = true
      this.confirmCallbackArgs = [$event, file, index]
    },

    async confirmed () {
      this.confirmDialogOpen = false
      let file = this.confirmCallbackArgs[1]

      try {
        let event = new CustomEvent('tdg-qstnnr-deleteBlobImage', {
          detail: {
            nameGuid: file.guid,
            fileName: file.fileName,
            isFileTypeImage: true
          },
          bubbles: true,
          cancelable: true
        })

        document.body.dispatchEvent(event)
      } catch (e) {
        console.log(e)
      }
    },

    cancel () {
      this.confirmDialogOpen = false
      let e = this.confirmCallbackArgs[0]
      e.stopPropagation()
    },

    setGalleryIndex () {
      this.galleryIndex = this.question.result.pictures.items.length === 0
        ? 0
        : this.question.result.pictures.items.length - 1
    },

    next () {
      this.galleryIndex = this.galleryIndex + 1 === this.question.result.pictures.items.length
        ? 0
        : this.galleryIndex + 1
    },

    prev () {
      this.galleryIndex = this.galleryIndex - 1 < 0
        ? this.question.result.pictures.items.length - 1
        : this.galleryIndex - 1
    }
  }

}

const IMAGES_PER_PAGE = 12

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
