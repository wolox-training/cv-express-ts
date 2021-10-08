export function checkPassword(password: string): string {
  const regexpPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regexpPassword.test(password) ? '' : 'password: password too weak';
}
