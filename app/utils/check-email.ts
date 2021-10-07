import { InternalError } from '../middlewares/error-handler';
import userService from '../services/users';
import { conflictRequest, unprocessableEntity } from '../errors';

export async function checkEmail(email: string): Promise<InternalError | null> {
  const regexpEmail = /@wolox.co/;
  if (!regexpEmail.test(email)) {
    return unprocessableEntity('email does not belong to domain');
  }
  const user = await userService.findUser({ email });
  if (user) {
    return conflictRequest('the email is taken');
  }
  return null;
}
