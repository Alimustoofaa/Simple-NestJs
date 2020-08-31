import { User } from './user.entity';
import * as bcyrpt from 'bcrypt';
import { async } from 'rxjs';

describe('User entity', () => {
    let user: User;

    beforeEach(() => {
        user = new User;
        user.password = 'TestPassword';
        user.salt = 'TestSalt';
    });

    describe('validatePassword', () => {
        it('Return true as password is valid', async () => {
            bcyrpt.hash = jest.fn().mockReturnValue('TestPassword');
            expect(bcyrpt.hash).not.toHaveBeenCalled();

            const result = await user.validatePassword('TestPassword');
            expect(bcyrpt.hash).toHaveBeenCalledWith('TestPassword', 'TestSalt');
            expect(result).toEqual(true);
        });

        it('Retrun false as password is invalid', async () => {
            bcyrpt.hash = jest.fn().mockReturnValue('WrongPassword');
            expect(bcyrpt.hash).not.toHaveBeenCalled();

            const result = await user.validatePassword('WrongPassword');
            expect(bcyrpt.hash).toHaveBeenCalledWith('WrongPassword', 'TestSalt');
            expect(result).toEqual(false);
        });
    });
})