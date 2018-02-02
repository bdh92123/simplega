const classes = {
  'ASSOSIATE': '준회원',
  'REGULAR': '정회원',
  'PRESIDENT': '회장',
  'GENERAL_AFFAIRS': '총무',
  'ADVISOR': '고문'
}

let getClassesLabel = function (classKey) {
  return classes[classKey]
}

export { getClassesLabel }
export default classes
