import { Infer, object, string } from 'superstruct';

type PlaydustProfileType = Infer<typeof PlaydustProfileType>;
const PlaydustProfileType = object({
  username: string(),
  email: string(),
  bio: string(),
  discordUsername: string(),
  twitterUsername: string(),
  profilePictureMintAddress: string(),
});

export default PlaydustProfileType;
