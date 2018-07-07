"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const entity_1 = require("./entity");
const defaultBoard = [
    ['o', 'o', 'o'],
    ['o', 'o', 'o'],
    ['o', 'o', 'o']
];
const allowedColors = ['Red', 'Blue', 'Green', 'Yellow', 'Magenta'];
const moves = (board1, board2) => board1
    .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
    .reduce((a, b) => a.concat(b))
    .length;
console.log(moves([
    ['o', 'o', 'o'],
    ['o', 'o', 'o'],
    ['o', 'o', 'o']
], [
    ['o', 'o', 'o'],
    ['o', 'X', 'o'],
    ['o', 'o', 'o']
]));
let GameController = class GameController {
    async allGames() {
        const games = await entity_1.default.find();
        return { games };
    }
    async createGame(name) {
        const randomColor = () => {
            return allowedColors[Math.floor(Math.random() * allowedColors.length)];
        };
        const newGame = new entity_1.default();
        newGame.name = name;
        newGame.color = randomColor();
        newGame.board = JSON.parse(JSON.stringify(defaultBoard));
        return newGame.save();
    }
    async makeMove(id, updateGame) {
        const game = await entity_1.default.findOne(id);
        const newMove = () => {
            if (!game)
                throw routing_controllers_1.HttpCode(404);
            new routing_controllers_1.NotFoundError('Error: Game not found!');
            if (moves(game.board, updateGame.board)) {
                if (moves.length > 1) {
                    routing_controllers_1.HttpCode(400);
                    new routing_controllers_1.BadRequestError('Invalid move: only 1 move at a time allowed!');
                }
                else {
                    return updateGame.board && entity_1.default.merge(game, updateGame).save();
                }
            }
            newMove();
            return updateGame.board;
        };
    }
};
__decorate([
    routing_controllers_1.Get('/games'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "allGames", null);
__decorate([
    routing_controllers_1.Post('/games'),
    routing_controllers_1.HttpCode(201),
    __param(0, routing_controllers_1.BodyParam('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "createGame", null);
__decorate([
    routing_controllers_1.Put('/games/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "makeMove", null);
GameController = __decorate([
    routing_controllers_1.JsonController()
], GameController);
exports.default = GameController;
//# sourceMappingURL=gamecontroller.js.map