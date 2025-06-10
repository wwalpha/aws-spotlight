import { Buffer } from 'buffer';

export const getUsername = (accessToken: string) => {
  const token = decodeToken(accessToken);

  return token.username;
};

const decodeToken = (token: string) => {
  const texts = token.split('.');

  // token format error
  if (texts.length !== 3) return;

  try {
    return JSON.parse(Buffer.from(texts[1], 'base64').toString());
  } catch (err) {
    console.log(err);
  }
};
