const accountTypes = [
  {
    id: 1,
    name: '식자재'
  },
  {
    id: 2,
    name: '회비'
  },
  {
    id: 3,
    name: '행사비'
  },
  {
    id: 4,
    name: '찬조'
  },
  {
    id: 5,
    name: '기타'
  }
]

let accountTypeMap = (function () {
  let typeMap = {}
  accountTypes.forEach((accountType) => {
    typeMap[accountType.id] = accountType
  })
  return typeMap
})()

let getAccountType = function (id) {
  return accountTypeMap[id]
}

export { getAccountType }
export default accountTypes
