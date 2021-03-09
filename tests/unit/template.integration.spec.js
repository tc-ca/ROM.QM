// import Vuetify from 'vuetify'
// import Vuex from 'vuex'
// import { mount, createLocalVue } from '@vue/test-utils'
// import Group from '../../src/components/questionnaire/group/group.vue'
import Ajv from 'ajv'
import templateSchema from '../../src/schema/newTemplateStructure.json'
import templateData from '../../public/static/templates/newTemplateExampleJSON.json'
import addFormats from 'ajv-formats'

let ajvWarnings = []
const ajv = new Ajv({
  logger: {
    log: console.log,
    warn: (message) => {
      console.log(message)
      ajvWarnings.push(message)
    },
    error: (message) => {
      throw new Error('AJV error: ' + message)
    }
  },
  allowUnionTypes: true,
  useDefaults: true
})

addFormats(ajv)

let badData = {
  name: 'badData',
  Questions: [
    {
      responseOptions: [
        {
          name: 'badResponse'
        }
      ]
    }
  ]
}

const validate = ajv.compile(templateSchema)

function FindNonUniqueIds (qObject, key) {
  var uniqueIds = []
  var issues = []
  var index = 0

  qObject.forEach(element => {
    if (!uniqueIds.includes(element[key])) {
      uniqueIds.push(element[key])
    } else {
      issues.push(`item ${index} has id ${element[key]} which is not unique`)
    }
    index++
  })

  if (issues.length > 0) {
    console.log(issues)
  }

  return issues
}

function flatten (qs) {
  var ret = []

  for (var i = 0; i < qs.length; i++) {
    let q = qs[i]

    if (q.childQuestions.length > 0) {
      ret = ret.concat(flatten(q.childQuestions))
    }

    ret.push(q)
  }
  return ret
}

function flattenQuestions (groups) {
  var flattenedQuestions = []
  groups.forEach(group => {
    var qs = flatten(group.questions)
    flattenedQuestions = flattenedQuestions.concat(qs)
  })
  return flattenedQuestions.sort((a, b) => (a.id > b.id) ? 1 : (b.id > a.id) ? -1 : 0)
}

describe('Template Data Validation Against TypeScript Schema', () => {
  it('all group id and question ids should be different', () => {
    var groupKey = 'name'
    var questionKey = 'name'

    // groups
    expect(FindNonUniqueIds(templateData.groups, groupKey).length).toEqual(0)

    // questions
    expect(FindNonUniqueIds(flattenQuestions(templateData.groups), questionKey).length).toEqual(0)
  })

  it('valid data should be successfully validated against the schema', () => {
    // as precompiled schema
    if (validate(templateData)) {
      expect(templateData.name).toBeTruthy()
    }

    if (validate.errors > 0) {
      console.log(validate.errors)
    }

    expect(validate.errors).toEqual(null)

    // as typeguard
    if (ajv.validate(templateSchema, templateData)) {
      expect(templateData.name).toBeTruthy()
    }

    if (validate.errors > 0) {
      console.log(validate.errors)
    }

    expect(ajv.errors).toEqual(null)
  })

  it('invalid data should not be successfully validated against the schema', () => {
    const validate = ajv.compile(templateSchema)

    if (!validate(badData)) {
      expect(badData.name).toEqual('badData')
    }

    expect(validate.errors).not.toEqual(null)

    if (!ajv.validate(templateSchema, badData)) {
      expect(badData.name).toEqual('badData')
    }

    expect(validate.errors).not.toEqual(null)
  })
})
