// TODO: allow to the ability to override the default test image
// TODO: make this into a library of its own
<script>
/* eslint-disable no-undef */
import '@resconet/jsbridge/src/JSBridge.js'
import base64Images from '../../api/base64-images.js'

export default {
  props: {
    maxImageSize: {
      type: String,
      default: '640x480',
      validator: function (value) {
        // The value must match one of these strings
        return ['640x480', '1024x768', '1600x1200', '2048x1536', '2592x1936', 'Default'].indexOf(value) !== -1
      }
    },
    onCaptureEmit: {
      type: String,
      required: true
    }

  },
  methods: {
    OpenCam () {
      var vm = this
      if (process.env.NODE_ENV === 'production') {
        var service = new MobileCRM.Services.DocumentService()
        service.maxImageSize = this.maxImageSize // maxImageSize can have one of following values: "Default", "640x480", "1024x768", "1600x1200", "2048x1536", "2592x1936"
        service.capturePhoto(
          function (fileInfo) {
            /// <param name='fileInfo' type='MobileCRM.Services.FileInfo '/>
            if (fileInfo.url) {
              MobileCRM.Application.readFileAsBase64(
                fileInfo.filePath,
                function (base64) {
                  vm.$emit(vm.onCaptureEmit, `data:image/jpeg;base64,${base64}`)
                },
                MobileCRM.bridge.alert
              )
            }
          },
          MobileCRM.bridge.alert
        )
      } else {
        vm.$emit(vm.onCaptureEmit, `data:image/jpeg;base64,${base64Images.image_001}`)
      }
    }
  },
  render () {
    return this.$scopedSlots.default({
      openDeviceCam: this.OpenCam
    })
  }
}

</script>
