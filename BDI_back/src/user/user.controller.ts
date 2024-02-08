import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { Roles } from '../shared/security/roles.decorator';
import { UserRole } from '../shared/enums/role.enum';
import { Public } from '../shared/security/public.decorator';

// Public() decorator is used to allow access to this endpoint without authentication
// Roles(...) decorator is used to allow access to this endpoint only for users with the specified roles
@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {
    constructor(
        private readonly userService : UserService,
        private readonly authService: AuthService
    ) {}

    @Roles(UserRole.ADMIN, UserRole.USER_ADMIN)
    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    // @Public()
    @Roles(UserRole.ADMIN, UserRole.USER_ADMIN, UserRole.USER_READ)
    @Get(':userId')
    async findOne(@Param('userId') userId: string) {
        return await this.userService.findOne(userId);
    }

    @Public()
    // The following line is commented because it is not necessary to specify the roles to access this endpoint
    // because it is necessary to create a user with any role
    // @Roles(UserRole.ADMIN, UserRole.USER_ADMIN, UserRole.USER_WRITE)
    @Post()
    async create(@Body() userDto: UserDto) {
        const user : UserEntity = plainToInstance(UserEntity, userDto);
        return await this.userService.create(user);
    }

    @Roles(UserRole.ADMIN, UserRole.USER_ADMIN, UserRole.USER_WRITE)
    @Put(':userId')
    async update(@Param('userId') userId: string, @Body() userDto: UserDto) {
        const user : UserEntity = plainToInstance(UserEntity, userDto);
        return await this.userService.update(userId, user);
    }

    @Roles(UserRole.ADMIN, UserRole.USER_ADMIN, UserRole.USER_DELETE)
    @Delete(':userId')
    @HttpCode(204)
    async delete(@Param('userId') userId: string) {
        return await this.userService.delete(userId);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req);
    }
}
