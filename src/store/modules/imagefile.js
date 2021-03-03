export const namespaced = true

export const state = {
    imageFileNotification: {
        imageResults: Object,
        fileResults: Object
    },
    imageData: {
        imageDetails: Object,
        fileDetails: Object
    },
    deletedImageData: {
        imageDetails: Object,
        fileDetails: Object
    }
}

export const getters = {
    
}

export const actions = {
  
}

export const mutations = {
    updateImageResult (state, payload) {
        state.imageFileNotification.imageResults = payload
    },
    updateImageBase64String (state, payload) {
        state.imageData.imageDetails = payload
    },
    deleteImageResult (state, payload) {
        state.deletedImageData.imageDetails = payload
    },

    updateFileResult (state, payload) {
        state.imageFileNotification.fileResults = payload
    },
    updateFileBase64String (state, payload) {
        state.imageData.fileDetails = payload
    },
    deleteFileResult (state, payload) {
        state.deletedImageData.fileDetails = payload
    },
}

