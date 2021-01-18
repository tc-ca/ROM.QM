import templateSchema from './template.json'
import templateData from '../../public/static/fullFeaturedTemplate.json'
import CombinationPackagingData from '../../public/static/CombinationPackaging.json'
import DesignAndManufacture from '../../public/static/DesignAndManufacture.json'
import HighwayTanks from '../../public/static/HighwayTanks.json'
import IBC from '../../public/static/IBC.json'
import ItermediateBulk from '../../public/static/ItermediateBulk.json'
import SelectionOfViolations from '../../public/static/SelectionOfViolations.json'

import { v4 as uuidv4 } from 'uuid'

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

function reassignGuids (groups) {
  var flattenedQuestions = flattenQuestions(groups)
  for (let i = 0; i < flattenedQuestions.length; i++) {
    const q = flattenedQuestions[i]
    if (!q.guid) {
      q.guid = uuidv4()
    }
  }
}

reassignGuids(DesignAndManufacture.groups)

console.log('fixed')