import { JsonController, Get, Param, Post, HttpCode, BodyParam, Put, NotFoundError, Body, BadRequestError} from 'routing-controllers'
import Game from './entity'
import { Validator } from 'class-validator';

const defaultBoard = [
	['o', 'o', 'o'],
	['o', 'o', 'o'],
	['o', 'o', 'o']
]

const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Magenta']

const validator = new Validator

@JsonController()
export default class GameController {

@Get('/games')
    async allGames() {
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
        @BodyParam('color') color: string,
        @Body() updateGame: Partial<Game>
        ) : Promise<Game> {
            const game = await Game.findOne(id)
                if (!game) 
                throw new NotFoundError('Error: Game not found!')
    
                if (validator.isNotIn(color, colors)) 
                throw new BadRequestError('Sorry, that is not a valid color!')

                const moves = (board1, board2) =>
                        board1
                            .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
                            .reduce((a, b) => a.concat(b))
                            .length

                if (updateGame.board == undefined) 
                    return Game.merge(game, updateGame).save()
                
                if (moves(game.board, updateGame.board) !== 1) 
                    throw new BadRequestError('Illegal move: only 1 move at a time please!')
                
            return Game.merge(game, updateGame).save()  
            }
        }
            
            
// const moves = (board1, board2) =>
//       board1
//         .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
//         .reduce((a, b) => a.concat(b))
//         .length
//     if (update.board == undefined) return Game.merge(game, update).save()
//     if (moves(game.board, update.board) !== 1) throw new NotFoundError('Too many moves1')


//     return Game.merge(game, update).save()