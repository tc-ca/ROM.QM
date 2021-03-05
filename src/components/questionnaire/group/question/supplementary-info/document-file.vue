<template>
  <v-list-item>
    <v-list-item-icon>
      <v-icon
        size="30"
      >
        mdi-file-{{ getFileType(file.fileName) }}
      </v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-sheet
        v-if="!speedDialOpen"
        color="#f5f5f5"
      >
        <v-list-item-subtitle>
          <span>{{ $t('app.questionnaire.group.question.supplementaryFile.fileTitle') }}</span>
          <span>{{ file.title }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <span>{{ $t('app.questionnaire.group.question.supplementaryFile.fileComment') }}</span>
          <span> {{ file.comment === '' ? 'N/A' : file.comment }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <span>{{ $t('app.questionnaire.group.question.supplementaryFile.fileUploadedBy') }}</span>
          <span>{{ file.userName }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <span>{{ $t('app.questionnaire.group.question.supplementaryFile.fileUploaded') }}</span>
          <span>{{ file.timeStamp }}</span>
        </v-list-item-subtitle>
      </v-sheet>
      <div v-if="speedDialOpen">
        <v-textarea
          v-model="file.title"
          auto-grow
          outlined
          :disabled="readonly"
          dense
          rows="1"
          label="Title"
          style="font-size: small"
        />
        <v-textarea
          v-model="file.comment"
          auto-grow
          outlined
          :disabled="readonly"
          dense
          placeholder=" "
          rows="1"
          label="Comment"
          style="font-size: small"
        />
      </div>
    </v-list-item-content>
    <v-list-item-icon>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-model="speedDialOpen"
            icon
            :disabled="!filenoteexist || readonly"
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
        <span>  {{ $t('app.questionnaire.group.question.supplementaryFile.editFile') }}</span>
      </v-tooltip>
    </v-list-item-icon>
    <v-list-item-icon>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="!filenoteexist || readonly"
            icon
            color="deep-orange"
            v-bind="attrs"
            v-on="on"
            @click.stop="$emit('remove:file', $event, file, index);"
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
            :disabled="!filenoteexist || readonly"
            icon
            color="blue"
            v-bind="attrs"
            v-on="on"
            @click.stop="$emit('download:file', file);"
          >
            <v-icon>mdi-download-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('app.questionnaire.group.question.supplementaryFile.downloadFile') }}</span>
      </v-tooltip>
    </v-list-item-icon>
    <v-list-item-icon />
  </v-list-item>
</template>

<script>

export default {
  props: {
    file: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    readonly: {
      type: Boolean,
      required: true
    },
    filenoteexist: {
      type: Boolean,
      required: true
    }
  },

  data: function () {
    return {
      speedDialOpen: false,
      validationStatus: false
    }
  },

  computed: { },

  methods: {
    getFileType (fileName) {
      let fileType
      let ext = fileName.substr(fileName.lastIndexOf('.') + 1)
      if (ext === 'pdf') fileType = 'pdf'
      else if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') fileType = 'excel'
      else if (ext === 'doc' || ext === 'docx') fileType = 'word'
      else fileType = 'document-outline'

      return fileType
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
