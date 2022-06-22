import { Infer, string, type, union } from 'superstruct';

type HubspotRedirect = Infer<typeof HubspotRedirect>;
const HubspotRedirect = type({
  redirectUri: string(),
});

type HubspotInlineMessage = Infer<typeof HubspotInlineMessage>;
const HubspotInlineMessage = type({
  inlineMessage: string(),
});

type HubspotSuccessResponseType = Infer<typeof HubspotSuccessResponseType>;
const HubspotSuccessResponseType = union([
  HubspotRedirect,
  HubspotInlineMessage,
]);

export default HubspotSuccessResponseType;
