export const namespaced = true

export const state = {
    imageFileNotification: {
        imageResults: Object
    },
    imageData: {
        imageDetails: Object
    },
    deletedImageData: {
        imageDetails: Object
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
    }
}

