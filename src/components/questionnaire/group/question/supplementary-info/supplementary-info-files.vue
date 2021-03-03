<template>
  <v-list-group v-show="displayFile">
    <template v-slot:activator>
      <v-list-item-title
        class="subtitle-1"
        style="color:#757575"
      >
        <v-row>
          <v-col>
            {{ label }}
            <v-icon
              v-if="isFileRequired"
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
          </v-col>
        </v-row>
      </v-list-item-title>
      <v-list-item-action>
        <v-icon
          v-if="errorInFile"
          color="red"
        >
          mdi-exclamation
        </v-icon>
      </v-list-item-action>
    </template>
    <v-list-item>
      <v-list-item-content>
        <v-sheet color="#f5f5f5">
          <v-row
            no-gutters
          >
            <v-col
              cols="12"
            >
              <v-file-input
                ref="fileUpload"
                style="padding-bottom:none"
                filled
                outlined
                multiple
                :placeholder="placeholderText"
                prepend-inner-icon="mdi-paperclip"
                prepend-icon=""
                :disabled="readOnly"
                @change="onFileChange"
              />
            </v-col>
            <v-col
              class=""
              cols="12"
            >
              <v-list
                v-if="file.value.length > 0"
                color="#f5f5f5"
                dense
              >
                <v-list-item-title
                  class="caption"
                  style="color:#757575"
                >
                  {{ $t('app.questionnaire.group.question.supplementaryFile.uploadedFiles') }}
                </v-list-item-title>

                <v-list-item
                  v-for="(f, index) in file.value"
                  :key="index"
                >
                  <v-list-item-icon>
                    <v-icon
                      size="30"
                    >
                      mdi-file-{{ f.fileType }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-sheet
                      v-if="!f.speedDialOpen"
                      color="#f5f5f5"
                    >
                      <v-list-item-subtitle>
                        <span>                  {{ $t('app.questionnaire.group.question.supplementaryFile.fileTitle') }}
                        </span> <span>{{ f.title }}</span>
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <span>                  {{ $t('app.questionnaire.group.question.supplementaryFile.fileComment') }}
                        </span><span> {{ f.comment === '' ? 'N/A' : f.comment }}</span>
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <span>                  {{ $t('app.questionnaire.group.question.supplementaryFile.fileUploadedBy') }}
                        </span> <span>{{ f.userName }}</span>
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <span>                  {{ $t('app.questionnaire.group.question.supplementaryFile.fileUploaded') }}
                        </span> <span>{{ f.timeStamp }}</span>
                      </v-list-item-subtitle>
                    </v-sheet>

                    <div v-if="f.speedDialOpen">
                      <v-textarea
                        v-model="f.title"
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
                        v-model="f.comment"
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
                          v-model="f.speedDialOpen"
                          icon
                          :disabled="!fileNoteExist || readOnly"
                          v-bind="attrs"
                          v-on="on"
                          @click="f.speedDialOpen = !f.speedDialOpen"
                        >
                          <v-icon v-if="f.speedDialOpen">
                            mdi-close
                          </v-icon>
                          <v-icon v-else>
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>  {{ $t('app.questionnaire.group.question.supplementaryFile.editFile') }}</span>
                    </v-tooltip>
                  </v-list-item-icon>
                  <v-list-item-icon>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          :disabled="!fileNoteExist || readOnly"
                          icon
                          color="deep-orange"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="removeFile($event, f, galleryIndex); updateResponseStore();"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('app.questionnaire.group.question.supplementaryFile.deleteFile') }}</span>
                    </v-tooltip>
                  </v-list-item-icon>
                  <v-list-item-icon>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          :disabled="!fileNoteExist || readOnly"
                          icon
                          color="blue"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="downloadFile(f); updateResponseStore();"
                        >
                          <v-icon>mdi-download-circle-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('app.questionnaire.group.question.supplementaryFile.downloadFile') }}</span>
                    </v-tooltip>
                  </v-list-item-icon>
                  <v-list-item-icon />
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="purple"
          />
        </v-sheet>
        <v-row>
          <v-col cols="12">
            <v-input
              ref="validationInput"
              v-model="file.value.length"
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
          </v-col>
        </v-row>
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script>

/* eslint-disable no-undef */
import moment from 'moment'
import BaseMixin from '../../../../../mixins/base'
import { v4 as uuidv4 } from 'uuid'
import mime from 'mime-types'
import { mapState } from 'vuex'

export default {
  name: 'SupplementaryInfoFiles',
  mixins: [BaseMixin],
  props: {
    file: {
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
      curImg: '',
      progressStatus: '',
      galleryIndex: 0,
      rules: [
        value => !this.file.display || !this.file.required ? true : this.file.value.length > 0 || 'Required.'
      ],
      validationStatus: false,
      notification: null,
      confirmDialogOpen: false,
      confirmCallbackArgs: null
    }
  },

  computed: {
    fileNoteExist () {
      return this.file.value[this.galleryIndex] !== undefined
    },
    displayFile () {
      return !this.file.display
    },
    isFileRequired () {
      return this.file.option === 'required'
    },
    errorInFile () {
      return this.displayFile && this.isFileRequired && !this.file.value.length > 0
    },
    placeholderText () {
      return this.isFileRequired ? this.$t('app.questionnaire.group.question.supplementaryFile.fileRequired') : this.$t('app.questionnaire.group.question.supplementaryFile.fileOptional')
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
      state => state.imagefile.imageFileNotification.fileResults,
      (value) => {
        if (value) {
          this.onUploadFile()
        }
      }
    )
    this.$store.watch(
      state => state.imagefile.imageData.fileDetails,
      (value) => {
        if (value) {
          this.onDownloadFile()
        }
      }
    )
    this.$store.watch(
      state => state.imagefile.deletedImageData.fileDetails,
      (value) => {
        if (value) {
          this.onDeleteFile()
        }
      }
    )
    this.$watch(
      '$refs.validationInput.validations',
      (newValue) => {
        let error = this.displayFile && this.isFileRequired && !this.file.value.length > 0
        this.onError(error)
      }
    )
  },
  methods: {
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
            isFileTypeImage: false
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
    onUploadFile () {
      let el = this.$store.state.imagefile.imageFileNotification.fileResults
      if (el !== null) {
        if (this.question.guid === el.qguid && !this.file.value.some(f => f.guid === el.guid)) {
          let fileType
          let ext = el.result.substr(el.result.lastIndexOf('.') + 1)
          if (ext === 'pdf') fileType = 'pdf'
          else if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') fileType = 'excel'
          else if (ext === 'doc' || ext === 'docx') fileType = 'word'
          else fileType = 'document-outline'

          this.file.value.push({
            title: el.result,
            fileName: el.result,
            comment: 'N/A',
            guid: el.guid,
            userName: this.userName,
            timeStamp: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
            fileType: fileType,
            speedDialOpen: false
          })
          this.progressStatus = ''
          this.next()
          this.next()
        }
      }
    },

    async downloadFile (file) {
      let event = new CustomEvent('tdg-qstnnr-downloadBlobImage', {
        detail: {
          nameGuid: file.guid,
          fileName: file.fileName,
          isFileTypeImage: false
        },
        bubbles: true,
        cancelable: true
      })
      document.body.dispatchEvent(event)
    },

    onDownloadFile () {
      let storeObj = this.$store.state.imagefile.imageData.fileDetails
      if (storeObj !== null) {
        var link = document.createElement('a')
        link.href = `data:${mime.lookup(storeObj.fileName)};base64,${storeObj.result}`
        link.download = storeObj.fileName
        document.body.appendChild(link)
        link.click()
        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          document.body.removeChild(link)
          window.URL.revokeObjectURL(e.target.result)
        }, 100)
      }
    },

    async removeFile ($event, file, index) {
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
            isFileTypeImage: false
          },
          bubbles: true,
          cancelable: true
        })

        document.body.dispatchEvent(event)
      } catch (e) {
        console.log(e)
      }
    },

    onDeleteFile () {
      let el = this.$store.state.imagefile.deletedImageData.fileDetails
      if (el !== null) {
        if (this.file.value.some(f => f.guid === el.guid)) {
          this.file.value.splice(this.file.value.findIndex(f => f.guid === el.guid), 1)
          this.prev()
          this.prev()
        }
      }
    },

    cancel () {
      this.confirmDialogOpen = false
      let e = this.confirmCallbackArgs[0]
      e.stopPropagation()
    },

    setGalleryIndex () {
      this.galleryIndex = this.file.value.length === 0
        ? 0
        : this.file.value.length - 1
    },
    next () {
      this.galleryIndex = this.galleryIndex + 1 === this.file.value.length
        ? 0
        : this.galleryIndex + 1
    },

    prev () {
      this.galleryIndex = this.galleryIndex - 1 < 0
        ? this.file.value.length - 1
        : this.galleryIndex - 1
    },

    updateResponseStore: function () {
      // Need to be changed because the updateSupplementaryInfo on the response store was deleted
      // const question = this.question
      // const group = this.group
      // const saveToProp = this.saveToProp
      // const response = this.files
      // this.$store.dispatch('updateSupplementaryInfo', { saveToProp, group, question, response })
    },
    onError (error) {
      this.file.validationStatus = !error
      if (!this.file.validationStatus) {
        this.file.notification = { header: `Question: ${this.question.text[this.lang]}`, text: `File is required on this question, please upload at least one.`, color: 'error' }
      } else {
        this.file.notification = null
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
