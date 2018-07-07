import { JsonController, Get, Param, Post, HttpCode, BodyParam, Put, NotFoundError, Body, BadRequestError } from 'routing-controllers'
// import {validate} from 'class-validator'
import Game from './entity'
// import GameModel from './model';

const defaultBoard = [
	['o', 'o', 'o'],
	['o', 'o', 'o'],
	['o', 'o', 'o']
]

const allowedColors = ['Red', 'Blue', 'Green', 'Yellow', 'Magenta']

const moves = (board1, board2) => 
board1
  .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
  .reduce((a, b) => a.concat(b))
  .length

console.log(moves([
	['o', 'o', 'o'],
	['o', 'o', 'o'],
	['o', 'o', 'o']
],[
	['o', 'o', 'o'],
	['o', 'X', 'o'],
	['o', 'o', 'o']
])
)

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
            return allowedColors[Math.floor(Math.random()* allowedColors.length)]
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
        @BodyParam('board') board: string,
        @Body() updateGame: Partial<Game>
        ) {
            const game = await Game.findOne(id)
            const newMove = () => {
                if (!game) 
                    throw new NotFoundError('Error: Game not found!')
        
                if (game && moves(board, updateGame.board)) {
                    if (moves.length > 1) {
                        throw new BadRequestError('Invalid move: only 1 move at a time allowed!')
                    } else {
                        const newBoard = updateGame.board && Game.merge(game, updateGame).save()
                        return newBoard
                        }
                    }
                newMove()
            } 
        } 
    }
        //
//       @Put('/games/:id')
//       async makeMove(
//         @Param('id') id: number,
//         @Body() updateGame: Partial<Game>
//         ) : Promise<Game> {
//             const game = await Game.findOne(id)
//             if (!game) 
//                 throw HttpCode(404)
//                 new NotFoundError('Error: Game not found!')
    
//             if (updateGame.board && game.board) {
//                 if (moves(game.board, updateGame.board).length > 1) { 
//                     HttpCode(400) 
//                     new BadRequestError('Invalid move: only 1 move at a time allowed!')
//                 } else {
//                     return Game.merge(game, updateGame).save()
//                 }
//             } 
            
//             return Game.merge(game, updateGame).save()  
//     }
// }
