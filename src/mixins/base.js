

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
    },
    isBuilderPage() {
      return this.$route.name === "builder";
    },
    isQuestionnairePage() {
      return this.$route.name === "questionnaire";
    },
    isFlatLegislationsDataAvailable() {
      if (this.$store.state.legislations.legislations === null) {
        return false;
      }
      if (this.$store.state.legislations.dataStructure !== "flat") {
        return false;
      }
      return true;
    },
    isQuestionnaireDataAvailable() {
      if (this.$store.state.questionnaire.questionnaire === null) {
        return false;
      }
      return true;
    },
    isCharacteristicsDataAvailable() {
      if (this.$store.state.characteristics.characteristics === null) {
        return false;
      }
      return true;
    }
  }
};
