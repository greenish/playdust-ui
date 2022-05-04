import type QueryNodeType from '../../../_types/QueryNodeType'

const queryValidationPredicate = (entry: QueryNodeType) => {
  if (entry.field === 'attribute') {
    return entry.value.length > 0 || entry.trait !== ''
  }

  if (entry.value === '') {
    return false
  }
  return true
}

export default queryValidationPredicate
