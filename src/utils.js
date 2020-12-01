import { v4 as uuidv4 } from 'uuid';

export function pad (n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

// works on primitive types
export function onlyUnique (value, index, self) {
  return self.indexOf(value) === index
}

// works on complex types
export function onlyUniqueObj (a, param) {
  return a.filter(function (item, pos, array) {
    return array.map(function (mapItem) {
      return mapItem[param]
    }).indexOf(item[param]) === pos
  })
}

export function groupBy (collection, property) {
  var i = 0; var val; var index
  var values = []; var result = []
  for (; i < collection.length; i++) {
    val = collection[i][property]
    index = values.indexOf(val)
    if (index > -1) { result[index].push(collection[i]) } else {
      values.push(val)
      result.push([collection[i]])
    }
  }
  return result
}

export function getQuestionReference (groups, question) {
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].questions !== null && groups[i].questions.length > 0) {
      const questionMatch = getQuestionReferenceRecurse(groups[i].questions, question)
      if (questionMatch !== null) return questionMatch
    }
  }
}

export function getQuestionReferenceRecurse (questions, question) {
  if (questions === null) return null
  if (questions !== null && questions.length > 0) {
    for (let qi = 0; qi < questions.length; qi++) {
      if (questions[qi].childQuestions !== null && questions[qi].childQuestions.length > 0) {
        const childMatch = getQuestionReferenceRecurse(questions[qi].childQuestions, question)
        if (childMatch !== null) return childMatch
      }

      if (question === questions[qi]) {
        return questions[qi]
      }
    }
  }
  return null
}

export function buildNotificationObject (q, text, icon = 'mdi-message-alert', lang = 'en', color = 'error') {
  const notice = { 
    guid: uuidv4(),
    header: `Question: ${q.text[lang]}`, 
    text: text, 
    icon: icon, 
    color: color 
  };
  return notice;
}
