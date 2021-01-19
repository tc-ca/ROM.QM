// import Vuetify from 'vuetify'
// import Vuex from 'vuex'
// import { mount, createLocalVue } from '@vue/test-utils'
// import Group from '../../src/components/questionnaire/group/group.vue'
import Ajv from 'ajv'
import templateSchema from '../../src/schema/template.json'
import templateData from '../../public/static/fullFeaturedTemplate.json'
import CombinationPackagingData from '../../public/static/CombinationPackaging.json'
import DesignAndManufacture from '../../public/static/DesignAndManufacture.json'
import HighwayTanks from '../../public/static/HighwayTanks.json'
import IBC from '../../public/static/IBC.json'
import ItermediateBulk from '../../public/static/ItermediateBulk.json'
import SelectionOfViolations from '../../public/static/SelectionOfViolations.json'
import { group } from 'console'

import { v4 as uuidv4 } from 'uuid'

// const vuetify = new Vuetify()
// const localVue = createLocalVue()
// localVue.use(Vuex)

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
  }
})

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

// function reassignGuids (groups) {
//   var flattenedQuestions = flattenQuestions(groups)
//   for (let i = 0; i < flattenedQuestions.length; i++) {
//     const q = flattenedQuestions[i]
//     if (!q.guid) {
//       q.guid = uuidv4()
//     }
//   }
// }

describe('Template Data Validation Against TypeScript Schema', () => {
  it('all group id and question ids should be different', () => {
    var groupKey = 'primaryKey'
    var questionKey = 'id'

    // groups
    expect(FindNonUniqueIds(templateData.groups, groupKey).length).toEqual(0)
    expect(FindNonUniqueIds(CombinationPackagingData.groups, groupKey).length).toEqual(0)
    expect(FindNonUniqueIds(DesignAndManufacture.groups, groupKey).length).toEqual(0)
    expect(FindNonUniqueIds(HighwayTanks.groups, groupKey).length).toEqual(0)
    expect(FindNonUniqueIds(IBC.groups, groupKey).length).toEqual(0)
    expect(FindNonUniqueIds(ItermediateBulk.groups, groupKey).length).toEqual(0)
    expect(FindNonUniqueIds(SelectionOfViolations.groups, groupKey).length).toEqual(0)

    // questions
    expect(FindNonUniqueIds(flattenQuestions(templateData.groups), questionKey).length).toEqual(0)
    expect(FindNonUniqueIds(flattenQuestions(CombinationPackagingData.groups), questionKey).length).toEqual(0)
    expect(FindNonUniqueIds(flattenQuestions(DesignAndManufacture.groups), questionKey).length).toEqual(0)
    expect(FindNonUniqueIds(flattenQuestions(HighwayTanks.groups), questionKey).length).toEqual(0)
    expect(FindNonUniqueIds(flattenQuestions(IBC.groups), questionKey).length).toEqual(0)
    expect(FindNonUniqueIds(flattenQuestions(ItermediateBulk.groups), questionKey).length).toEqual(0)
    expect(FindNonUniqueIds(flattenQuestions(SelectionOfViolations.groups), questionKey).length).toEqual(0)
  })

  it('valid data should be successfully validated against the schema', () => {
    // as precompiled schema
    if (validate(templateData)) {
      expect(templateData.name).toEqual('Full Featured Template')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)

    // as typeguard
    if (ajv.validate(templateSchema, templateData)) {
      expect(templateData.name).toEqual('Full Featured Template')
    }

    console.log(validate.errors)

    expect(ajv.errors).toEqual(null)
  })

  it('Client Template: Combination Packaging data should be successfully validated against the schema', () => {
    if (validate(CombinationPackagingData)) {
      expect(CombinationPackagingData.name).toEqual('Combination packaging (4g) Design and Manufacture for the Transportation of Dangerous Goods pursuant to Part 1 of tp14850')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('Client Template: DesignAndManufacture data should be successfully validated against the schema', () => {
    if (validate(DesignAndManufacture)) {
      expect(DesignAndManufacture.name).toEqual('DesignAndManufacture')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('Client Template: Highway Tanks data should be successfully validated against the schema', () => {
    if (validate(HighwayTanks)) {
      expect(HighwayTanks.name).toEqual('HighwayTanks')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('Client Template: IBC data should be successfully validated against the schema', () => {
    if (validate(IBC)) {
      expect(IBC.name).toEqual('IBC')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('Client Template: ItermediateBulk data should be successfully validated against the schema', () => {
    if (validate(ItermediateBulk)) {
      expect(ItermediateBulk.name).toEqual('ItermediateBulk')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('Client Template: SelectionOfViolations data should be successfully validated against the schema', () => {
    if (validate(SelectionOfViolations)) {
      expect(SelectionOfViolations.name).toEqual('SelectionOfViolations')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('invalid data should not be successfully validated against the schema', () => {
    const validate = ajv.compile(templateSchema)

    if (!validate(badData)) {
      expect(badData.name).toEqual('badData')
    }

    console.log(validate.errors)

    expect(validate.errors).not.toEqual(null)

    if (!ajv.validate(templateSchema, badData)) {
      expect(badData.name).toEqual('badData')
    }

    console.log(validate.errors)

    expect(validate.errors).not.toEqual(null)
  })
})
