type MetaplexOffChainDataType = {
  name: string;
  symbol: string;
  external_url: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
  collection?: {
    name: string;
    family: string;
  };
};
export default MetaplexOffChainDataType;
