import { Buffer } from 'buffer';
import defaultTo from 'lodash/defaultTo';

type Tokens = {
  idToken: string;
  accessToken: string;
  refreshToken?: string;
};

type RefreshSession = (accessToken?: string, refreshToken?: string) => Promise<Tokens | undefined>;

export default class Credentials {
  private accessToken?: string;
  private idToken?: string;
  private refreshToken?: string;
  private storage: Storage;
  private username?: string;
  private keyPrefix: string;

  constructor(prefix: string) {
    this.storage = window.sessionStorage;
    this.username = defaultTo(this.storage.getItem(`${prefix}.username`), undefined);

    if (this.username) {
      this.idToken = defaultTo(this.storage.getItem(`${prefix}.${this.username}.idToken`), undefined);
      this.accessToken = defaultTo(this.storage.getItem(`${prefix}.${this.username}.accessToken`), undefined);
      this.refreshToken = defaultTo(this.storage.getItem(`${prefix}.${this.username}.refreshToken`), undefined);
    }

    this.keyPrefix = prefix;
  }

  /** refresh session tokens */
  refreshSession?: RefreshSession;

  getSession = async (): Promise<Tokens | undefined> => {
    if (!this.username) {
      return;
    }

    // token valid
    if (!this.isTokenValid()) {
      // refresh session not implemented
      if (!this.refreshSession || typeof this.refreshSession !== 'function') {
        return;
      }

      // validation
      if (!this.accessToken || !this.refreshToken) {
        return;
      }

      // refresh session
      const session = await this.refreshSession(this.accessToken, this.refreshToken);

      if (session) {
        this.idToken = session.idToken;
        this.accessToken = session.accessToken;
      }
    }

    return {
      idToken: this.idToken as string,
      accessToken: this.accessToken as string,
      refreshToken: this.refreshToken,
    };
  };

  setUsername = (username: string) => {
    this.username = username;
    this.storage.setItem(`${this.keyPrefix}.username`, username);
  };

  setUserTokens = (tokens: Tokens) => {
    this.idToken = tokens.idToken;
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;

    this.cacheTokens();
  };

  private cacheTokens = () => {
    const idTokenKey = `${this.keyPrefix}.${this.username}.idToken`;
    const accessTokenKey = `${this.keyPrefix}.${this.username}.accessToken`;
    const refreshTokenKey = `${this.keyPrefix}.${this.username}.refreshToken`;

    if (this.idToken) {
      this.storage.setItem(idTokenKey, this.idToken);
    }
    if (this.accessToken) {
      this.storage.setItem(accessTokenKey, this.accessToken);
    }
    if (this.refreshToken) {
      this.storage.setItem(refreshTokenKey, this.refreshToken);
    }
  };

  /** token validation */
  private isTokenValid = () => {
    // token not exist
    if (!this.accessToken) {
      return false;
    }

    const texts = this.accessToken.split('.');

    // token format error
    if (texts.length !== 3) {
      return false;
    }

    try {
      const token = JSON.parse(Buffer.from(texts[1], 'base64').toString());

      // token format error
      if (!token.exp) return false;

      // token expired
      return token.exp > new Date().getTime() / 1000;
    } catch (err) {
      console.log(err);
      // token format error
      return false;
    }
  };
}
