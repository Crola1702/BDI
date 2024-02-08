import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConstants from '../shared/security/constants';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        try {
            const user: UserEntity = await this.usersService.findByUsername(username);
            if (user && user.password === password) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async login(req: any) {
        const payload = { username: req.user.username, role: req.user.role, sub: req.user.id };
        return {
            username: req.user.username,
            token: this.jwtService.sign(payload, { privateKey: jwtConstants.JWT_SECRET }),
        };
    }
}
