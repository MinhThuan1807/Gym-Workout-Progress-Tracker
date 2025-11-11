export const FIELD_REQUIRED_MESSAGE: string = 'This field is required.'
export const EMAIL_RULE: RegExp = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE: string =
  'Email is invalid. (example@gmail.com)'
export const PASSWORD_RULE: RegExp =
  /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE: string =
  'Password must include at least 1 uppercase letter, a number, a special character, and be at least 8 characters long.'
export const PASSWORD_CONFIRMATION_MESSAGE: string =
  'Password Confirmation does not match!'

export const SECRET_KEY_RULE = /^[A-Za-z0-9+/]{43}=$/
export const SECRET_KEY_MESSAGE =
  'Secret key must be a valid 32-byte base64 encoded string (44 characters).'
