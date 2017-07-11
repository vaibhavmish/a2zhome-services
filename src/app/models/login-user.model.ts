import { Address } from './address.model';

export class LoginUserRequest {
  email: string;
  password: string;
}

export class LoginUserResponse {
  _id: string;
  mobile: string;
  email: string;
  name: string;
  photo: string;
  address: Address[];
  message: string;
  referal_code: String;
}
