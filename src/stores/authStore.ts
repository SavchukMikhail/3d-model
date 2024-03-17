import { jwtDecode } from 'jwt-decode';
import { makeAutoObservable } from 'mobx';

import AuthApiService from '../services/api/AuthApiService';

const AUTH_TOKENS_KEY = 'authTokens';

class AuthStore {
  public username = '';

  public password = '';

  public isLoading = false;

  public currentUser: any = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setUsername(login: string) {
    this.username = login;
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public checkIsAuthorized() {
    const authTokens = localStorage.getItem(AUTH_TOKENS_KEY);

    this.currentUser = authTokens ? jwtDecode(authTokens) : null;
    console.log(this.currentUser);
    return this.currentUser !== null;
  }

  public async signIn() {
    try {
      this.isLoading = true;

      const data = await AuthApiService.login({ username: this.username, password: this.password });
      localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(data));
      this.currentUser = jwtDecode(data.access);
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }

  public clearUserInfo() {
    localStorage.removeItem(AUTH_TOKENS_KEY);
    this.currentUser = null;
  }
}

export default new AuthStore();
