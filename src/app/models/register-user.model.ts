export class RegisterUserRequest {
  name: string;
  email: string;
  number: string;
  pass: string;
}

export class RegisterUserResponse {
  message: string;
  referal_code: string;
  name: string;
  email: string;
  mobile: string;
  _id: string;
  user_type: string;
  pass: string;
  verified: string;
}
