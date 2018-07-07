import { JsonController, Get, Post, Put, Body, Param, NotFoundError, HttpCode } from 'routing-controllers'
import Users from './entity'
// import { URLSearchParams } from 'url';

@JsonController()
export default class AdsController {

    @Get('/users/:id')
    getUser(
      @Param('id') id: number
    ) {
      return Users.findOne(id)
    }

    @Get('/users')
    async allUsers() {
      const users = await Users.find()
      return { users }
    }

    @Post('/users')
    @HttpCode(201)
        createUser(
    @Body() body: Users
    ): Users {
        console.log(`Incoming POST body param:`, body)
        return body
    }

    @Post('/users')
    @HttpCode(201)
        updateUsers(
    @Body() user: Users
    ) {
    return user.save()
    }

    @Put('/users/:id')
    async updateUser(
        @Param('id') id: number,
        @Body() update: Partial<Users>
    )

 {
    const user = await Users.findOne(id)
    if (!user) throw new NotFoundError('Cannot find page')

    return Users.merge(user, update).save()
}
}