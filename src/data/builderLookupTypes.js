import { LANGUAGE } from "../constants";
import { QUESTION_TYPE } from "../data/questionTypes";

const QUESTION_TYPES = [
  {
    value: QUESTION_TYPE.TEXT,
    text: {
      [LANGUAGE.ENGLISH]: "Text",
      [LANGUAGE.FRENCH]: "Fr: Text"
    }
  },
  {
    value: QUESTION_TYPE.RADIO,
    text: {
      [LANGUAGE.ENGLISH]: "Radio",
      [LANGUAGE.FRENCH]: "Fr: radio"
    }
  },
  {
    value: QUESTION_TYPE.SELECT,
    text: {
      [LANGUAGE.ENGLISH]: "Select",
      [LANGUAGE.FRENCH]: "Fr: Select"
    }
  },
  {
    value: QUESTION_TYPE.NUMBER,
    text: {
      [LANGUAGE.ENGLISH]: "Number",
      [LANGUAGE.FRENCH]: "Fr: Number"
    }
  },
  // {
  //   value: QUESTION_TYPE.IMAGE,
  //   text: {
  //     [LANGUAGE.ENGLISH]: "Image",
  //     [LANGUAGE.FRENCH]: "Fr: Image"
  //   }
  // },
  {
    value: QUESTION_TYPE.REFERENCE,
    text: {
      [LANGUAGE.ENGLISH]: "Reference",
      [LANGUAGE.FRENCH]: "Fr: Reference"
    }
  }
];

const OPTION_TYPES = [
  {
    value: "required",
    text: {
      [LANGUAGE.ENGLISH]: "Required",
      [LANGUAGE.FRENCH]: "Fr: Required"
    }
  },
  {
    value: "optional",
    text: {
      [LANGUAGE.ENGLISH]: "Optional",
      [LANGUAGE.FRENCH]: "Fr: Optional"
    }
  },
  {
    value: "n/a",
    text: {
      [LANGUAGE.ENGLISH]: "N/A",
      [LANGUAGE.FRENCH]: "Fr: N/A"
    }
  }
];

const VALIDATOR_TYPES = [
  {
    value: "require",
    text: {
      [LANGUAGE.ENGLISH]: "Require",
      [LANGUAGE.FRENCH]: "Fr: Require"
    }
  },
  {
    value: "min",
    text: {
      [LANGUAGE.ENGLISH]: "Min",
      [LANGUAGE.FRENCH]: "Fr: Min"
    }
  },
  {
    value: "max",
    text: {
      [LANGUAGE.ENGLISH]: "Max",
      [LANGUAGE.FRENCH]: "Fr: Max"
    }
  },
  {
    value: "minLength",
    text: {
      [LANGUAGE.ENGLISH]: "Min Length",
      [LANGUAGE.FRENCH]: "Fr: Min Length"
    }
  },
  {
    value: "maxLength",
    text: {
      [LANGUAGE.ENGLISH]: "Max Length",
      [LANGUAGE.FRENCH]: "Fr: Max Length"
    }
  }
];

const DEPENDENCY_GROUP_TYPES = [
  {
    value: "visibility",
    text: {
      [LANGUAGE.ENGLISH]: "Visibility",
      [LANGUAGE.FRENCH]: "Fr: Visibility"
    }
  },
  {
    value: "validation",
    text: {
      [LANGUAGE.ENGLISH]: "Enable Validator",
      [LANGUAGE.FRENCH]: "Fr: Enable Validator"
    }
  },
  {
    value: "validationValue",
    text: {
      [LANGUAGE.ENGLISH]: "Set validator rule",
      [LANGUAGE.FRENCH]: "Fr: Set validator rule"
    }
  }
];

const DEPENDENCY_VALIDATION_ACTIONS = [
  {
    value: null,
    text: {
      [LANGUAGE.ENGLISH]: "--",
      [LANGUAGE.FRENCH]: "--"
    }
  },
  {
    value: "equal",
    text: {
      [LANGUAGE.ENGLISH]: "Equal",
      [LANGUAGE.FRENCH]: "Fr: Equal"
    }
  },
  {
    value: "notEqual",
    text: {
      [LANGUAGE.ENGLISH]: "Not Equal",
      [LANGUAGE.FRENCH]: "Fr: Not Equal"
    }
  },
  {
    value: "greaterThen",
    text: {
      [LANGUAGE.ENGLISH]: "Greater then",
      [LANGUAGE.FRENCH]: "Fr: Greater then"
    }
  },
  {
    value: "lessThen",
    text: {
      [LANGUAGE.ENGLISH]: "Less than",
      [LANGUAGE.FRENCH]: "Fr: Less than"
    }
  },
  {
    value: "lengthLessThen",
    text: {
      [LANGUAGE.ENGLISH]: "length less then",
      [LANGUAGE.FRENCH]: "Fr: length less then"
    }
  },
  {
    value: "lengthGreaterThen",
    text: {
      [LANGUAGE.ENGLISH]: "Length greater then",
      [LANGUAGE.FRENCH]: "Fr: Length greater then"
    }
  }
];

export default {
  QUESTION_TYPES,
  OPTION_TYPES,
  VALIDATOR_TYPES,
  DEPENDENCY_GROUP_TYPES,
  DEPENDENCY_VALIDATION_ACTIONS,
};
