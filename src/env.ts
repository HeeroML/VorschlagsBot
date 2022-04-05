import { config } from "dotenv";

import { cleanEnv, num, str } from "envalid";
config();
export default cleanEnv(process.env, {
  TOKEN: str(),
  CACHE: num(),
  MONGO: str(),
  DOMAIN: str(),
});
