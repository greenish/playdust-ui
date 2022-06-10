import CollectionOverviewResponseType from '../_types/CollectionOverviewResponseType';

type Column = {
  label: string;
  getValue: (data: CollectionOverviewResponseType) => ReactNode;
};

const columns: Column[] = [
  {
    label: 'Collection',
    getValue: humanizeCollection,
  },
  {
    label: 'Total Volume',
    getValue: ({ volume }) => humanizeSolana(volume.global.total),
  },
  {
    label: 'Floor Price',
    getValue: ({ floorPrice }) => humanizeSolana(floorPrice.global),
  },
  {
    label: 'Items',
    getValue: ({ elementCount }) => elementCount.toLocaleString(),
  },
  {
    label: 'Listed Items',
    getValue: ({ listed }) => listed.toLocaleString(),
  },
  {
    label: 'Listed In',
    getValue: () => null,
  },
];
