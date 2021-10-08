import { InternalError } from '../middlewares/error-handler';
import userService from '../services/users';
import { conflictRequest, unprocessableEntity } from '../errors';

export function checkEmailDomain(email: string): boolean {
  const regexpEmail = /@wolox\.co$/;
  return regexpEmail.test(email);
}

export async function checkEmail(email: string): Promise<InternalError | null> {
  if (!checkEmailDomain(email)) {
    return unprocessableEntity('email does not belong to domain');
  }
  const user = await userService.findUser({ email });
  if (user) {
    return conflictRequest('the email is taken');
  }
  return null;
}
