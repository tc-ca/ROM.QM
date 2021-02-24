export const namespaced = true

export const state = {
    imageFileNotification: {
        qid: []
    },
    imageData: {
        imageDetails: []
    },
    deletedImageData: {
        imageDetails: []
    }
}

export const getters = {
    imageFileId: state => {
        return state.imageFileNotification.qid
    }
}

export const actions = {
  
}

export const mutations = {
    updateImageResult (state, payload) {
        state.imageFileNotification.qid.push(payload)
    },
    updateImageBase64String (state, payload) {
        state.imageData.imageDetails.push(payload)
    },
    deleteImageResult (state, payload) {
        state.deletedImageData.imageDetails.push(payload)
    }
}

