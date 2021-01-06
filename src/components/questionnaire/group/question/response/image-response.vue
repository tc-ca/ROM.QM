<template>
  <div>
    <v-row>
      <v-col>
        <!-- Camera Button -->
        <app-camera
          max-image-size="640x480"
          on-capture-emit="imageCaptured"
          @imageCaptured="addImageToArray($event); updateResponseStore();"
        >
          <v-btn
            slot-scope="{openDeviceCam}"
            color="teal"
            :disabled="readOnly"
            fab
            @click="openDeviceCam"
          >
            <v-icon>mdi-camera-plus-outline</v-icon>
          </v-btn>
        </app-camera>
      </v-col>
      <v-col>
        <v-btn-toggle rounded>
          <!-- Retake Photo Button  -->

          <app-camera
            max-image-size="640x480"
            on-capture-emit="imageCapturedtest"
            @imageCapturedtest="changeImage($event); updateResponseStore();"
          >
            <v-btn
              slot-scope="{openDeviceCam}"
              :disabled="!imageNoteExist || readOnly"
              fab
              @click="openDeviceCam"
            >
              <v-icon>mdi-camera-retake</v-icon>
            </v-btn>
          </app-camera>
          <!-- Edit Photo Button  -->

          <v-btn
            v-model="speedDialOpen"
            fab
            :disabled="!imageNoteExist || readOnly"
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
            :disabled="!imageNoteExist || readOnly"
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
                      :disabled="readOnly"
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
                :disabled="readOnly"
                dense
                rows="1"
                label="Title"
                @change="updateResponseStore()"
              />
              <v-textarea
                v-model="images[galleryIndex].comment"
                auto-grow
                outlined
                :disabled="readOnly"
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
      :rules="validationRules"
      :disabled="readOnly"
      @update:error="onError"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import '@resconet/jsbridge/src/JSBridge.js'
import moment from 'moment'
import AppCamera from '../../../../base-camera/base-camera.vue'
import { MAX_IMAGE_UPLOADS_PER_ANSWER } from '../../../../../config.js'
import BaseMixin from '../../../../../mixins/base'

export default {
  components: { AppCamera },
  mixins: [BaseMixin],
  props: {
    question: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      images: [],
      galleryIndex: 0,
      speedDialOpen: false,
      validationRules: [
        value => {
          if (this.question.isVisible) {
            for (let i = 0; i < this.question.validationRules.length; i++) {
              let ruleDefinition = this.question.validationRules[i]
              if (!ruleDefinition.enabled) {
                continue
              }
              let errorMessage = ruleDefinition.errorMessage[this.lang]
              if (ruleDefinition.type === 'require') {
                if (!this.images.length) {
                  return errorMessage
                }
              } else if (ruleDefinition.type === 'minLength') {
                if (this.images.length < ruleDefinition.value) {
                  return errorMessage.replace('{0}', ruleDefinition.value)
                }
              } else if (ruleDefinition.type === 'maxLength') {
                if (this.images.length > ruleDefinition.value) {
                  return errorMessage.replace('{0}', ruleDefinition.value)
                }
              }
            }
          }
          return true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
    }),
    imageNoteExist () {
      return this.images[this.galleryIndex] !== undefined
    }

  },
  mounted () {
    this.$watch(
      '$refs.validationInput.validations.length',
      (newValue) => {
        this.onError(!!newValue)
      }
    )
  },
  methods: {
    addImageToArray (base64) {
      if (this.images.length < MAX_IMAGE_UPLOADS_PER_ANSWER) {
        this.images.push({ base64String: base64, title: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS), comment: '', timeStamp: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) })
        // this.images.push(base64)
        this.next()
        this.$emit('change', this.images)
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
      this.$emit('change', this.images)
    },

    async changeImage (base64) {
      if (this.envProd) {
        this.images[this.galleryIndex].base64String = base64
      }
      this.$emit('change', this.images)
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

    },
    onError (error) {
      this.$emit('error', error)
    }
  }
}
</script>

<style scoped>

</style>
