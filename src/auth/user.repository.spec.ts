import { async } from "rxjs"
import { Test } from "@nestjs/testing"
import { UserRepository } from "./user.repository"
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

const mockCredentialDto = { username: 'TestUsername', password: 'Test_Password'};

describe('UserRepository', () => {
    let userRepository;

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
            expect(userRepository.signUp(mockCredentialDto)).resolves.not.toThrow();
        });

        it('throws a conflic exeptionn as username already exists', () => {
            save.mockResolvedValue({ code: '23505' });
            expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(ConflictException);
        })

        it('throws a conflic exeptionn as username already exists', () => {
            save.mockResolvedValue({ code: '313132' });
            expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(InternalServerErrorException);
        })
    });
});