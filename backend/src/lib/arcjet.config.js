import arcjet, {
  shield,
  detectBot,
  tokenBucket,
  fixedWindow,
  slidingWindow,
} from "@arcjet/node";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
});

