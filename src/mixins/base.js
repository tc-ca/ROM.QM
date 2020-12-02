

export default {
  data() {
    return {
      env: process.env.NODE_ENV,
      loadLocalData: process.env.VUE_APP_LOAD_LOCAL_DATA === "true"
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
