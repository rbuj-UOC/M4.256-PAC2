export class AuthDTO {
  user_id: string | null;
  access_token: string | null;
  email: string | null;
  password: string | null;

  constructor(
    user_id: string | null,
    access_token: string | null,
    email: string | null,
    password: string | null
  ) {
    this.user_id = user_id;
    this.access_token = access_token;
    this.email = email;
    this.password = password;
  }
}
