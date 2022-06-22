import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import HubspotErrorResponseType from './_types/HubspotErrorResponseType';
import HubspotResponseType from './_types/HubSpotResponseType';
import HubspotSuccessResponseType from './_types/HubSpotSuccessResponseType';

const originalFormId = 'bc45ba74-8293-429d-ae47-70b5f09e3b90';
const clonedFormId = '474508e1-c364-40a6-81c0-bc89f7451f63';
const formId = originalFormId; // clonedFormId
const portalId = '21785114';

interface JoinWaitlistNextApiRequest extends NextApiRequest {
  body: {
    email: string;
  };
}

const joinWaitlist = async (
  req: JoinWaitlistNextApiRequest,
  res: NextApiResponse<HubspotResponseType>
) => {
  const { email } = req.body;

  const hapikey = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!hapikey) {
    throw new Error('Required env variable HUBSPOT_ACCESS_TOKEN not found.');
  }

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

  const data = {
    fields: [
      {
        objectTypeId: '0-1',
        name: 'email',
        value: email,
      },
    ],
  };

  try {
    const resp = await axios.post<HubspotSuccessResponseType>(url, data, {
      params: {
        hapikey,
      },
    });

    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError<HubspotErrorResponseType>;

      if (serverError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return res
          .status(serverError.response.status)
          .json(serverError.response.data);
      }
    }

    return res.status(500);
  }
};

export default joinWaitlist;
