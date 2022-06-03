import { Infer, object, string } from 'superstruct';

type PlaydustProfileType = Infer<typeof PlaydustProfileType>;
const PlaydustProfileType = object({
  name: string(),
  email: string(),
});

export default PlaydustProfileType;
