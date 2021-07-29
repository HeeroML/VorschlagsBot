import { connect } from "mongoose";
import env from "../env";

export default () => // @ts-ignore
    connect(env.MONGO, { useUnifiedTopology: true, useNewUrlParser: true });
