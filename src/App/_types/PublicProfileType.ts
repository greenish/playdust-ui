import { boolean, coerce, Infer, nullable, object, string } from 'superstruct';

const StringToBoolean = coerce(
  boolean(),
  string(),
  (value) => value === 'true'
);

type PublicProfileType = Infer<typeof PublicProfileType>;
const PublicProfileType = object({
  username: string(),
  bio: string(),
  profilePictureMintAddress: nullable(string()),
  isWhitelisted: StringToBoolean,
  isAdmin: StringToBoolean,
});

export default PublicProfileType;
