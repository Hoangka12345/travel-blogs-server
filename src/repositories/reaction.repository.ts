import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { Reaction } from "src/model/reaction.model";

@Injectable()
export class ReactionRepository extends BaseRepository<Reaction> {
    constructor(
        @InjectModel(Reaction.name)
        private readonly reactionModel: Model<Reaction>
    ) {
        super(reactionModel)
    }

}