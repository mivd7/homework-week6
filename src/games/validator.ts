import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({ name: "BoardValidation", async: false })
export class Validator implements ValidatorConstraintInterface {

    validate(board:  string[][]) {
        return Array.isArray(board) && board.length === 3
         && board.every(Array.isArray)
         && board.every(element => element.length === 3)
         && board.every(element => element.every(field => ['X','O'].indexOf(field)!== -1) )
    }

    defaultMessage() { 
        return "Illegal board move! Use only 'X' or 'O' please";
    }
}