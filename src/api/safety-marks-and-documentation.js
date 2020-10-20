/* eslint-disable indent */
export default {
    groups: [{
        primaryKey: '',
        title: {
          'en-US': 'Documentation',
          'fr-FR': 'Fr: New Group'
        },
        isRepeatable: true,
        isVisible: true,
        showKey: '',
        hideKey: '',
        order: 0,
        domSuffix: 'prop value created virtually',
        htmlElementId: 'prop value created virtually',
        questions: [{
            name: 'Question 1',
            id: 1,
            sortOrder: 1,
            isVisible: true,
            text: {
              'en-US': 'Are the  dangerous goods accompanied by a shipping document?',
              'fr-FR': 'FR: Are the  dangerous goods accompanied by a shipping document?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              },
              {
                id: 3,
                sortOrder: 3,
                text: {
                  'en-US': 'None On Site ',
                  'fr-FR': 'FR: None On Site'
                },
                value: 2
              },
              {
                id: 4,
                sortOrder: 4,
                text: {
                  'en-US': 'Not Inspected',
                  'fr-FR': 'FR: Not Inspected'
                },
                value: 3
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: true,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [{
              name: 'Question 2',
              id: 2,
              sortOrder: 0,
              isVisible: false,
              text: {
                'en-US': 'Is the information on the shipping document compliant?',
                'fr-FR': 'FR: Is the information on the shipping document compliant?'
              },
              type: 'radio',
              response: null,
              responseOptions: [{
                  id: 1,
                  sortOrder: 1,
                  text: {
                    'en-US': 'Yes',
                    'fr-FR': 'FR: Yes'
                  },
                  value: 1
                },
                {
                  id: 2,
                  sortOrder: 2,
                  text: {
                    'en-US': 'No',
                    'fr-FR': 'FR: No'
                  },
                  value: 0
                },
                {
                  id: 3,
                  sortOrder: 3,
                  text: {
                    'en-US': 'Not Inspected',
                    'fr-FR': 'FR: Not Inspected'
                  },
                  value: 2
                }
              ],
              validationRules: [{
                name: 'require',
                enabled: true,
                type: 'require',
                value: null,
                errorMessage: {
                  'en-US': 'Required',
                  'fr-FR': 'FR: Required'
                }
              }],
              violationInfo: {
                responseToMatch: 0,
                matchingType: 'equal'
              },
              childQuestions: [],
              dependants: [],
              dependencyGroups: [{
                  ruleType: 'visibility',
                  childValidatorName: null,
                  questionDependencies: [{
                    dependsOnQuestion: 1,
                    validationAction: 'equal',
                    validationValue: 1
                  }]
                },
                {
                  ruleType: 'validation',
                  childValidatorName: null,
                  questionDependencies: [{
                    dependsOnQuestion: 1,
                    validationAction: 'equal',
                    validationValue: 0
                  }]
                }
              ]
            }],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 3',
            id: 3,
            sortOrder: 3,
            isVisible: true,
            text: {
              'en-US': 'For dangerous goods no longer in transport are there 2 years of shipping documents (paper or electronic) available for review?',
              'fr-FR': 'FR: For dangerous goods no longer in transport are there 2 years of shipping documents (paper or electronic) available for review?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No - Non Compliant',
                  'fr-FR': 'FR: No - Non Compliant'
                },
                value: 0
              },
              {
                id: 3,
                sortOrder: 3,
                text: {
                  'en-US': 'No - 15 Day',
                  'fr-FR': 'FR: Option 3'
                },
                value: 3
              },
              {
                id: 4,
                sortOrder: 4,
                text: {
                  'en-US': 'N/A',
                  'fr-FR': 'FR: N/A'
                },
                value: 4
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: true,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 4',
            id: 4,
            sortOrder: 4,
            isVisible: true,
            text: {
              'en-US': 'Road: Are the shipping document located according to regulation ?',
              'fr-FR': 'FR: Road: Are the shipping document located according to regulation ?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              },
              {
                id: 3,
                sortOrder: 3,
                text: {
                  'en-US': 'None On Site',
                  'fr-FR': 'FR: None On Site'
                },
                value: 2
              },
              {
                id: 4,
                sortOrder: 4,
                text: {
                  'en-US': 'Not Inspected',
                  'fr-FR': 'FR: Not Inspected'
                },
                value: 3
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: false,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 5',
            id: 5,
            sortOrder: 5,
            isVisible: true,
            text: {
              'en-US': 'Rail: Are the shipping document and the consist located according to the regulation ?',
              'fr-FR': 'FR: Rail: Are the shipping document and the consist located according to the regulation ?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              },
              {
                id: 3,
                sortOrder: 3,
                text: {
                  'en-US': 'None On Site',
                  'fr-FR': 'FR: None On Site'
                },
                value: 2
              },
              {
                id: 4,
                sortOrder: 4,
                text: {
                  'en-US': 'Not Inspected',
                  'fr-FR': 'FR: Not Inspected'
                },
                value: 3
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: false,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 6',
            id: 6,
            sortOrder: 6,
            isVisible: true,
            text: {
              'en-US': 'Marine: Are the shipping document located according to regulation?',
              'fr-FR': 'Marine: Are the shipping document located according to regulation?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              },
              {
                id: 3,
                sortOrder: 3,
                text: {
                  'en-US': 'None On Site',
                  'fr-FR': 'FR: None On Site'
                },
                value: 2
              },
              {
                id: 4,
                sortOrder: 4,
                text: {
                  'en-US': 'Not Inspected',
                  'fr-FR': 'FR: Not Inspected'
                },
                value: 3
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: false,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 7',
            id: 7,
            sortOrder: 7,
            isVisible: true,
            text: {
              'en-US': 'Are the shipping documents or the electronic copies kept according to the regulations for storage in the course of Transportation ?',
              'fr-FR': 'FR: Are the shipping documents or the electronic copies kept according to the regulations for storage in the course of Transportation ?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              },
              {
                id: 3,
                sortOrder: 3,
                text: {
                  'en-US': 'None On Site',
                  'fr-FR': 'FR: None On Site'
                },
                value: 2
              },
              {
                id: 4,
                sortOrder: 4,
                text: {
                  'en-US': 'Not Inspected',
                  'fr-FR': 'FR: Not Inspected'
                },
                value: 3
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: true,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 8',
            id: 8,
            sortOrder: 8,
            isVisible: true,
            text: {
              'en-US': 'Does the MOC facility keep a record of the clients?',
              'fr-FR': 'FR: Does the MOC facility keep a record of the clients?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              },
              {
                id: 3,
                sortOrder: 3,
                text: {
                  'en-US': 'None On Site',
                  'fr-FR': 'FR: None On Site'
                },
                value: 2
              },
              {
                id: 4,
                sortOrder: 4,
                text: {
                  'en-US': 'Not Inspected',
                  'fr-FR': 'FR: Not Inspected'
                },
                value: 3
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: true,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 9',
            id: 9,
            sortOrder: 9,
            isVisible: true,
            text: {
              'en-US': 'Usage of a Permit for Equivalent Level of Safety',
              'fr-FR': 'FR: Usage of a Permit for Equivalent Level of Safety'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              },
              {
                id: 3,
                sortOrder: 3,
                text: {
                  'en-US': 'None On Site',
                  'fr-FR': 'FR: None On Site'
                },
                value: 2
              },
              {
                id: 4,
                sortOrder: 4,
                text: {
                  'en-US': 'Not Inspected',
                  'fr-FR': 'FR: Not Inspected'
                },
                value: 3
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: true,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 10',
            id: 10,
            sortOrder: 10,
            isVisible: true,
            text: {
              'en-US': 'Usage of a protective direction',
              'fr-FR': 'FR: Usage of a protective direction'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              },
              {
                id: 3,
                sortOrder: 3,
                text: {
                  'en-US': 'None On Site',
                  'fr-FR': 'FR: None On Site'
                },
                value: 2
              },
              {
                id: 4,
                sortOrder: 4,
                text: {
                  'en-US': 'Not Inspected',
                  'fr-FR': 'FR: Not Inspected'
                },
                value: 3
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: true,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          }
        ]
      },
      {
        primaryKey: '',
        title: {
          'en-US': 'Safety Marks',
          'fr-FR': 'Fr: New Group'
        },
        isRepeatable: false,
        isVisible: true,
        showKey: '',
        hideKey: '',
        order: 1,
        domSuffix: 'prop value created virtually',
        htmlElementId: 'prop value created virtually',
        questions: [{
            name: 'Question 12',
            id: 12,
            sortOrder: 12,
            isVisible: true,
            text: {
              'en-US': 'Are the display of safety marks on a small means of containment compliant?',
              'fr-FR': 'FR: Are the display of safety marks on a small means of containment compliant?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: false,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 13',
            id: 13,
            sortOrder: 13,
            isVisible: true,
            text: {
              'en-US': 'Are the display of safety marks on a large means of containment compliant?',
              'fr-FR': 'FR: Are the display of safety marks on a large means of containment compliant?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: false,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 14',
            id: 14,
            sortOrder: 14,
            isVisible: true,
            text: {
              'en-US': 'Are the display of safety marks on an overpack compliant?',
              'fr-FR': 'FR: Are the display of safety marks on an overpack compliant?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: false,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 15',
            id: 15,
            sortOrder: 15,
            isVisible: true,
            text: {
              'en-US': 'Are the display of safety marks on a Consolidation Bin compliant?',
              'fr-FR': 'FR: Are the display of safety marks on a Consolidation Bin compliant?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: false,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          },
          {
            name: 'Question 16',
            id: 16,
            sortOrder: 16,
            isVisible: true,
            text: {
              'en-US': 'Are the Placards and UN Numbers on a Compartmentalized Large Means of Containment compliant?',
              'fr-FR': 'FR: Are the Placards and UN Numbers on a Compartmentalized Large Means of Containment compliant?'
            },
            type: 'radio',
            response: null,
            responseOptions: [{
                id: 1,
                sortOrder: 1,
                text: {
                  'en-US': 'Yes',
                  'fr-FR': 'FR: Yes'
                },
                value: 1
              },
              {
                id: 2,
                sortOrder: 2,
                text: {
                  'en-US': 'No',
                  'fr-FR': 'FR: No'
                },
                value: 0
              }
            ],
            validationRules: [{
              name: 'require',
              enabled: false,
              type: 'require',
              value: null,
              errorMessage: {
                'en-US': 'Required',
                'fr-FR': 'FR: Required'
              }
            }],
            violationInfo: {
              responseToMatch: 0,
              matchingType: 'equal'
            },
            childQuestions: [],
            dependants: [],
            dependencyGroups: []
          }
        ]
      }
    ]
}
