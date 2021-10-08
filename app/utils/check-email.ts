import { InternalError } from '../middlewares/error-handler';
import userService from '../services/users';
import { conflictRequest } from '../errors';

export async function checkEmail(email: string): Promise<InternalError | null> {
  const user = await userService.findUser({ email });
  if (user) {
    return conflictRequest('the email is taken');
  }
  return null;
}
