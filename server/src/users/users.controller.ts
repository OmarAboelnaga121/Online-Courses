import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/auth/decorators/user.decorator';
import { UserDto } from 'src/auth/dto';

@Controller('users')
export class UsersController {

    // TODO: Get User Profile
    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get user profile' })
    @ApiBearerAuth()
    getProfile(
        @User() user : UserDto
    ) {
        
        return user;
    }
}
