import { IAuthPostDto } from 'shared/interfaces';

import BaseApiService from './BaseApiService';

class AuthApiService extends BaseApiService {
  constructor() {
    super('api/token/');
  }

  login(authData: IAuthPostDto): Promise<{ access: string; refresh: string }> {
    return this.POST('', authData);
  }
}

export default new AuthApiService();
