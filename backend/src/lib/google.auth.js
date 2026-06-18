import ENV from "./env.js";
import { OAuth2Client } from "google-auth-library"



const client = new OAuth2Client(
  ENV.GOOGLE_CLIENT_ID
);

export default client