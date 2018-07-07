import { JsonController, Get, Param, Post, HttpCode, BodyParam, Put, NotFoundError, Body, BadRequestError } from 'routing-controllers'
import Game from './entity'

const defaultBoard = [
	['o', 'o', 'o'],
	['o', 'o', 'o'],
	['o', 'o', 'o']
]

const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Magenta']

const moves = (board1, board2) => 
board1
  .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
  .reduce((a, b) => a.concat(b))
  .length


@JsonController()
export default class GameController {

    @Get('/games')
    async allGames() {
      const games = await Game.find()
      return { games }
    }

    // @Get('/games/:id')
    // getGame(
    // @Param('id') id: number
    // ) {
    //   return Game.findOne(id)
    // }

    @Post('/games')
    @HttpCode(201)
       async createGame(
    @BodyParam('name') name : string,
    ) { const randomColor = () => {
            return colors[Math.floor(Math.random()* colors.length)]
        }
        const newGame = new Game()
        newGame.name = name
        newGame.color = randomColor()
        newGame.board = JSON.parse(JSON.stringify(defaultBoard))

        return newGame.save()
      }

      @Put('/games/:id')
      async makeMove(
        @Param('id') id: number,
        @Body() updateGame: Partial<Game>
        ) : Promise<Game> {
            const game = await Game.findOne(id)
            if (!game) 
                throw HttpCode(404)
                new NotFoundError('Error: Game not found!')
    
            if (updateGame.board) {
                if (moves(game.board, updateGame.board) > 1) { 
                    HttpCode(400) 
                    new BadRequestError('Invalid move: only 1 move at a time allowed!')
                } else {
                    return Game.merge(game, updateGame).save()
                }
            } 
            return Game.merge(game, updateGame).save()  
    }
}