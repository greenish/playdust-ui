import { Infer, union } from 'superstruct';
import HubspotErrorResponseType from './HubspotErrorResponseType';
import HubspotSuccessResponseType from './HubSpotSuccessResponseType';

type HubspotResponseType = Infer<typeof HubspotResponseType>;
const HubspotResponseType = union([
  HubspotSuccessResponseType,
  HubspotErrorResponseType,
]);

export default HubspotResponseType;
