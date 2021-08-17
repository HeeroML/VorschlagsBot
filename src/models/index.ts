import {connect, set} from "mongoose";
import env from "../env";

export default () =>
    connect(env.MONGO, {useUnifiedTopology: true, useNewUrlParser: true});
set('useFindAndModify', false)
