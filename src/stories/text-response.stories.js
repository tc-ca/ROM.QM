import PureTextResponse from '../components/questionnaire/group/question/response/pure-text-response'
import { action } from '@storybook/addon-actions'
import { withKnobs, object } from '@storybook/addon-knobs'

export default {
  title: 'text-response',
  excludeStories: /.*Data$/,
  decorators: [withKnobs]
}

const taskTemplate = `<pure-text-response :question="question ":lang="lang" @error="onError"/>`

export const questionData = {
  'name': 'Question 1', 'id': 1, 'sortOrder': 1, 'isVisible': true, 'text': { 'en-US': 'Question text', 'fr-FR': 'FR: Question text' }, 'type': 'text', 'response': null, 'responseOptions': [{ 'id': 1, 'sortOrder': 1, 'text': { 'en-US': 'Yes', 'fr-FR': 'FR: Yes' }, 'value': 'true' }, { 'id': 2, 'sortOrder': 2, 'text': { 'en-US': 'No', 'fr-FR': 'FR: No' }, 'value': 'false' }], 'validationRules': [{ 'name': 'require', 'enabled': true, 'type': 'require', 'value': null, 'errorMessage': { 'en-US': 'Required', 'fr-FR': 'FR: Required' } }], 'violationInfo': { 'responseToMatch': 'false', 'matchingType': 'equal' }, 'childQuestions': [], 'dependants': [], 'dependencyGroups': [], 'validationState': false
}

// default task state
export const Default = () => ({
  components: { PureTextResponse },
  template: taskTemplate,
  props: {
    question: {
      default: () => questionData
    },
    lang: {
      default: object('lang', 'en-US')
    }
  },
  methods: { onError: action('error') }
})
// {
// components: { PureTextResponse },
//   template: taskTemplate,
//   props: {
//     question: {
//       default: () => questionData
//     },
//     lang: {
//       default: object('lang', 'en-US')
//     }
//   },
// }

// export const Default = () => ({
//   components: { PureTextResponse },
//   template: taskTemplate,
//   props: {
//     question: {
//       default: () => questionData
//     },
//     lang: {
//       default: () => "en-US"
//     }
//   }
// });
