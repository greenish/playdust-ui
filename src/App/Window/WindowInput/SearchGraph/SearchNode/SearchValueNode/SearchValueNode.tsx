import React from 'react';
import { useRecoilValue } from 'recoil';
import searchQueryChildAtom from '../_atoms/searchQueryChildAtom';
import SearchAttributeNode from './AttributeNode/AttributeNode';
import SearchCollectionNode from './CollectionNode';
import RangeNode from './RangeNode';
import SearchTextNode from './SearchTextNode/SearchTextNode';

interface SearchValueNodeProps {
  id: string;
}

function SearchValueNode(props: SearchValueNodeProps) {
  const data = useRecoilValue(searchQueryChildAtom(props.id));

  if (!data) {
    return null;
  }

  switch (data.field) {
    case 'collection':
      return <SearchCollectionNode id={props.id} />;
    case 'attribute':
      return <SearchAttributeNode id={props.id} />;
    case 'text':
      return <SearchTextNode id={props.id} />;
    case 'range':
      return <RangeNode id={props.id} />;
    default:
      return null;
  }
}

export default SearchValueNode;
