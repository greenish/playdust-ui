import { Infer, object, string } from 'superstruct';

type PublicProfileType = Infer<typeof PublicProfileType>;
const PublicProfileType = object({
  username: string(),
  bio: string(),
  profilePictureMintAddress: string(),
});

export default PublicProfileType;
