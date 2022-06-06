import Cookies from 'js-cookie';
import { selector } from 'recoil';
import { create, Infer, object, string } from 'superstruct';
import connectedWalletAtom from '../../../_atoms/connectedWalletAtom';
import authenticationApi from '../_helpers/authenticationApi';
import signedAuthMesssageAtom from './signedAuthMesssageAtom';

type LoginResponseType = Infer<typeof LoginResponseType>;
const LoginResponseType = object({
  accessToken: string(),
  refreshToken: string(),
});

const validateAuthToken = (input: string | undefined) => {
  if (!input) {
    return null;
  }

  try {
    const parsedInput: unknown = JSON.parse(input);
    const tokens = create(parsedInput, LoginResponseType);

    return tokens;
  } catch {
    return null;
  }
};

const isJWTExpired = (token: string | undefined): boolean => {
  if (token === undefined) {
    return true;
  }

  try {
    const bufferString = Buffer.from(token.split('.')[1], 'base64').toString();
    const parsed = JSON.parse(bufferString) as { exp: number };

    return Date.now() >= parsed.exp * 1000;
  } catch {
    return true;
  }
};

const cookieKey = 'userAuthAtomCookie';

const cookieApi = {
  get: () => Cookies.get(cookieKey),
  set: (value: LoginResponseType) =>
    Cookies.set(cookieKey, JSON.stringify(value)),
  remove: () => Cookies.remove(cookieKey),
};

const tokensAtom = selector<LoginResponseType | null>({
  key: 'tokensAtom',
  get: async ({ get }) => {
    const signedAuthMessage = get(signedAuthMesssageAtom);
    const connectedWallet = get(connectedWalletAtom);
    const cookieString = cookieApi.get();
    const tokens = validateAuthToken(cookieString);
    const { refreshToken, accessToken } = tokens || {};
    const isAccessTokenValid = !isJWTExpired(accessToken);
    const isRefreshTokenValid = !isJWTExpired(refreshToken);

    if (!tokens && signedAuthMessage) {
      const { data } = await authenticationApi.post<LoginResponseType>(
        '/login',
        {
          nonce: signedAuthMessage.nonce,
          wallet: connectedWallet,
          message: signedAuthMessage.message,
        }
      );

      cookieApi.set(data);

      return data;
    }

    if (!tokens) {
      return null;
    }

    if (isAccessTokenValid && tokens) {
      return tokens;
    }

    if (isRefreshTokenValid && refreshToken) {
      const { data } = await authenticationApi.post<{ token: string }>(
        '/token',
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const nextValue: LoginResponseType = {
        accessToken: data.token,
        refreshToken,
      };

      cookieApi.set(nextValue);

      return nextValue;
    }

    cookieApi.remove();

    return null;
  },
  set: (_a, newValue) => {
    if (newValue === null) {
      cookieApi.remove();
    }
  },
});

export default tokensAtom;
