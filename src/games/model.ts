import {IsString, IsIn, Validate} from 'class-validator'
import {Validator} from './validator'


export default class Model {

    @IsString({message: "Must be a string"})
    name: string

    @IsIn(["Red","Blue","Green","Yellow","Magenta"], {
        message: 'sorry not a valid color'})
    color: string

    @Validate(Validator)
    board: string[][]
}