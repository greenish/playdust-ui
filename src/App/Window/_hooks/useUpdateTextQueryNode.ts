import makeUseQueryChange from '../_helpers/makeUseQueryChange'
import updateQueryNode from '../_helpers/updateQueryNode'

interface UseUpdateTextNodeInputType {
  id: string
  text: string
}

const useUpdateTextQueryNode = makeUseQueryChange<UseUpdateTextNodeInputType>(
  (query) =>
    ({ text, id }) => {
      const nextQuery = updateQueryNode(query, id, { value: text })

      return { query: nextQuery }
    }
)

export default useUpdateTextQueryNode
