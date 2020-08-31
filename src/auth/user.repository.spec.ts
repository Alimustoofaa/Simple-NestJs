import { async } from "rxjs"
import { Test } from "@nestjs/testing"
import { UserRepository } from "./user.repository"
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { User } from "./user.entity";
import * as bcyrpt from "bcrypt";

const mockCredentialDto = { username: 'TestUsername', password: 'Test_Password'};

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ],
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {
        let save;
        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        it('Sucessfuly signUp this user', async () => {
            await save.mockResolvedValue(undefined);
            await expect(userRepository.signUp(mockCredentialDto)).resolves.not.toThrow();
        });

        it('throws a conflic exeptionn as username already exists', async() => {
            await save.mockResolvedValue({ code: '23505' });
            await expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(ConflictException);
        })

        it('throws a conflic exeptionn as username already exists', async () => {
            await save.mockResolvedValue({ code: '313132' });
            await expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(InternalServerErrorException);
        })
    });

    describe('validateUserPassword', () => {
        let user;
        
        beforeEach(() => {
         
            user = new User();
            user.username = 'TestUsername';
            user.validatePassword = jest.fn();
        });
        
        it('return username as validation is succesfull', async () => {
            userRepository.findOne = jest.fn().mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);

            const result = await userRepository.validateUserPassword(mockCredentialDto);
            expect(result).toEqual('TestUsername');
        });

        it('return null as user cannot be found', async () => {
            userRepository.findOne = jest.fn().mockResolvedValue(null);
            const result = await userRepository.validateUserPassword(mockCredentialDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('return null as password is invalid', async () => {
            userRepository.findOne = jest.fn().mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            const result = await userRepository.validateUserPassword(mockCredentialDto);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('hashPassword', () => {
        it('call bcyrpt.has to generate a hash', async () => {
            bcyrpt.hash = jest.fn().mockResolvedValue('TestHash');
            expect(bcyrpt.hash).not.toHaveBeenCalled();

            const result = await userRepository.hashPassword('TestPassword', 'TestSalt');
            expect(bcyrpt.hash).toHaveBeenCalledWith('TestPassword', 'TestSalt');
            expect(result).toEqual('TestHash');
        })
    })
});