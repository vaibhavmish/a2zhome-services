export class RequestCallback {
  name: string;
  email: string;
  mobile: string;
  location: string;
  type: string;
  user_id: string;

  constructor() {
    this.name = '';
    this.email = '';
    this.mobile = '';
    this.location = '';
    this.type = 'user';
    this.user_id = '';
  }
}

export class Client {
  _id: string;
  photo: string;
}

export class Feedback {
  name: string;
  email: string;
  number: string;
  message: string;
  type: string;
}

export class Message {
  name: string;
  email: string;
  phone: string;
  message: string;
  location: string;
}