export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  name: string;
  lastName: string;
  identificationNum: string;
  confirmPassword: string;
  role?: string;
}