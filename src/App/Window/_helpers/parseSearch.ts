import SearchStateType from '../_types/SearchStateType';

const parseSearch = (input: string): SearchStateType => {
  try {
    const created = SearchStateType.create(JSON.parse(input));

    return created;
  } catch {
    return {
      query: {
        rootId: '',
        nodes: {},
      },
    };
  }
};

export default parseSearch;
