const english = 'en-US'
const french = 'fr-FR'

module.exports = Object.freeze({
  LANGUAGE: {
    ENGLISH: english,
    FRENCH: french
  },

  BUILDER: {
    QUESTION_TYPES: [
      {
        value: "text",
        text: {
          [english]: "Text",
          [french]: "Fr: Text"
        }
      },
      {
        value: "radio",
        text: {
          [english]: "Radio",
          [french]: "Fr: radio"
        }
      },
      {
        value: "select",
        text: {
          [english]: "Select",
          [french]: "Fr: Select"
        }
      },
      {
        value: "number",
        text: {
          [english]: "Number",
          [french]: "Fr: Number"
        }
      },
      {
        value: "image",
        text: {
          [english]: "Image",
          [french]: "Fr: Image"
        }
      }
    ],

    OPTION_TYPES: [
      {
        value: "required",
        text: {
          [english]: "Required",
          [french]: "Fr: Required"
        }
      },
      {
        value: "optional",
        text: {
          [english]: "Optional",
          [french]: "Fr: Optional"
        }
      },
      {
        value: "n/a",
        text: {
          [english]: "N/A",
          [french]: "Fr: N/A"
        }
      }
    ],
    VALIDATOR_TYPES: [
      {
        value: "require",
        text: {
          [english]: "Require",
          [french]: "Fr: Require"
        }
      },
      {
        value: "min",
        text: {
          [english]: "Min",
          [french]: "Fr: Min"
        }
      },
      {
        value: "max",
        text: {
          [english]: "Max",
          [french]: "Fr: Max"
        }
      },
      {
        value: "minLength",
        text: {
          [english]: "Min Length",
          [french]: "Fr: Min Length"
        }
      },
      {
        value: "maxLength",
        text: {
          [english]: "Max Length",
          [french]: "Fr: Max Length"
        }
      }
    ],

    DEPENDENCY_GROUP_TYPES: [
      {
        value: "visibility",
        text: {
          [english]: "Visibility",
          [french]: "Fr: Visibility"
        }
      },
      {
        value: "validation",
        text: {
          [english]: "Enable Validator",
          [french]: "Fr: Enable Validator"
        }
      },
      {
        value: "validationValue",
        text: {
          [english]: "Set validator rule",
          [french]: "Fr: Set validator rule"
        }
      }
    ],
    DEPENDENCY_VALIDATION_ACTIONS: [
      {
        value: null,
        text: {
          [english]: "--",
          [french]: "--"
        }
      },
      {
        value: "equal",
        text: {
          [english]: "Equal",
          [french]: "Fr: Equal"
        }
      },
      {
        value: "notEqual",
        text: {
          [english]: "Not Equal",
          [french]: "Fr: Not Equal"
        }
      },
      {
        value: "greaterThen",
        text: {
          [english]: "Greater then",
          [french]: "Fr: Greater then"
        }
      },
      {
        value: "lessThen",
        text: {
          [english]: "Less than",
          [french]: "Fr: Less than"
        }
      },
      {
        value: "lengthLessThen",
        text: {
          [english]: "length less then",
          [french]: "Fr: length less then"
        }
      },
      {
        value: "lengthGreaterThen",
        text: {
          [english]: "Length greater then",
          [french]: "Fr: Length greater then"
        }
      }
    ]
  }
});
