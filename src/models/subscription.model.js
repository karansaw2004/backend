import mongoose, {Schema, Types} from "mongoose";


const subscriptionSchema = new Schema(
    {
        subscriber:{
            
            types: Schema.Types.ObjectId,   //one who is subscribing
            ref: "User"
        },
        channels:{
            types: Schema.Types.ObjectId,  //one whom to subscriber is subscribing
            ref: "User"
        }
    }
)


export const Subscription = mongoose.model("Subscription",subscriptionSchema);