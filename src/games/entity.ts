import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsJSON } from 'class-validator'

@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('text')
  @IsString()
  name: string

  @Column('text')
  @IsString()
  color: string

  @Column('json')
  @IsJSON()
  board: JSON
}