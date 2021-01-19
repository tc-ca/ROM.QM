// import Vuetify from 'vuetify'
// import Vuex from 'vuex'
// import { mount, createLocalVue } from '@vue/test-utils'
// import Group from '../../src/components/questionnaire/group/group.vue'
import Ajv from 'ajv'
import templateSchema from '../../src/schema/template.json'
import templateData from '../../public/static/templates/fullFeaturedTemplate.json'
import CombinationPackagingData from '../../public/static/templates/CombinationPackaging.json'
import DesignAndManufacture from '../../public/static/templates/DesignAndManufacture.json'
import HighwayTanks from '../../public/static/templates/HighwayTanks.json'
import IBC from '../../public/static/templates/IBC.json'
import ItermediateBulk from '../../public/static/templates/ItermediateBulk.json'
import SelectionOfViolations from '../../public/static/templates/SelectionOfViolations.json'
import Beta2Testing from '../../public/static/templates/beta2Testing.json'

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
  },
  allowUnionTypes: true
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
      expect(DesignAndManufacture.name).toEqual('Design and Manufacture of Small Containers for the Transportation of Dangerous Goods Pursuant to Part 1 of TP14850')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('Client Template: Highway Tanks data should be successfully validated against the schema', () => {
    if (validate(HighwayTanks)) {
      expect(HighwayTanks.name).toEqual('Highway Tanks - TC 406 and TC 406 Crude')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('Client Template: IBC data should be successfully validated against the schema', () => {
    if (validate(IBC)) {
      expect(IBC.name).toEqual('IBC Leak test and inspection facility for the Transportation of DG CAN/CGSB-43.146')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('Client Template: ItermediateBulk data should be successfully validated against the schema', () => {
    if (validate(ItermediateBulk)) {
      expect(ItermediateBulk.name).toEqual('INTERMEDIATE BULK CONTAINERS DESIGN AND MANUFACTURE FOR THE TRANSPORTATION OF DANGEROUS GOODS PURSUANT TO PART 1 OF CGSB-43.146-2002')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('Client Template: SelectionOfViolations data should be successfully validated against the schema', () => {
    if (validate(SelectionOfViolations)) {
      expect(SelectionOfViolations.name).toEqual('selection of Violations')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
  })

  it('Client Template: Beta2Testing data should be successfully validated against the schema', () => {
    if (validate(Beta2Testing)) {
      expect(Beta2Testing.name).toEqual('certificate (equivalency, temporary or emergency).')
    }

    console.log(validate.errors)

    expect(validate.errors).toEqual(null)
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
