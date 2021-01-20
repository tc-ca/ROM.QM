

export default {
  data() {
    return {
      env: process.env.NODE_ENV,
      loadLocalData: process.env.VUE_APP_LOAD_LOCAL_DATA === "true",
      localDataToLoad: process.env.VUE_APP_TEMPLATE_TO_LOAD
    };
  },
  computed: {
    envDev() {
      return this.env === "development";
    },
    envProd() {
      return this.env === "production";
    }
  }
};
