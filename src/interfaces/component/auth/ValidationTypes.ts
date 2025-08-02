export interface ValidationErrors {
  email?: string;
  password?: string;
  fullName?: string;
  passwordConfirm?: string;
}

export interface PasswordValidation {
  minLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  isValid: boolean;
}
