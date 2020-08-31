import { JwtSrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { from, async } from "rxjs";
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
    findOne: jest.fn(),
});

describe('JwtStrategy', () => {
    let jwtSrategy: JwtSrategy;
    let userRepository;

    beforeEach( async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtSrategy,
                { provide: UserRepository, useFactory: mockUserRepository },
            ],
        }).compile();
        
        jwtSrategy = await module.get<JwtSrategy>(JwtSrategy);
        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('validate', () => {
        it('validate and return the user bassed on JWT paylod', async () => {
            const user = new User;
            user.username = 'TestUser';

            userRepository.findOne.mockResolvedValue(user);
            const result = await jwtSrategy.validate({ username: 'TestUser'});
            expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'TestUser'});
            expect(result).toEqual(user);
        });

        it('throws an unathorized as user cannot be found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            expect(jwtSrategy.validate({ username: 'TestUSer'})).rejects.toThrow(UnauthorizedException);
        })
    });
});