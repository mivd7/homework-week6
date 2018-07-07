import { JsonController, Get, Param, Post, HttpCode, BodyParam } from 'routing-controllers'
import Game from './entity'

const defaultBoard = [
	['o', 'o', 'o'],
	['o', 'o', 'o'],
	['o', 'o', 'o']
]

@JsonController()
export default class GameController {

    @Get('/games')
    async allPages() {
      const games = await Game.find()
      return { games }
    }

    @Get('/games/:id')
    getGame(
    @Param('id') id: number
    ) {
      return Game.findOne(id)
    }

    @Post('/games')
    @HttpCode(201)
       async createGame(
    @BodyParam('name') name : string,
    ) { const randomColor = () => {
            const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Magenta']
            return colors[Math.floor(Math.random()* colors.length)]
        }
        const newGame = new Game()
        newGame.name = name
        newGame.color = randomColor()
        newGame.board = JSON.parse(JSON.stringify(defaultBoard))

        return newGame.save()
      }
    }
