import { model } from "mongoose";
import { Schema } from "mongoose";

interface GROUPS {
  groupID: string;
  userId: Number;
  groupName: string;
  groupLink: string;
  groupDescription: string;
  groupCategorie: number;
  groupType: number;
}

const schema = new Schema<GROUPS>({
  groupID: {
    type: String,
    unique: true,
  },
  userId: {
    type: Number,
    unique: false,
  },
  groupName: {
    type: String,
    required: true,
  },
  groupLink: {
    type: String,
  },
  groupDescription: {
    type: String,
  },
  groupCategorie: {
    type: Number,
  },
  groupType: {
    type: Number,
  },
});

const GROUP = model("Groups", schema);

export const createGroup = (userId: number, access: string) =>
  GROUP.updateOne({}, { userId, access }, { upsert: true });

export const getGroupID = async (groupID: number) => {
  const r = await GROUP.findOne({ groupID }).exec();
  return r;
};
export const getGroupLink = async (groupLink: string) => {
  const r = await GROUP.findOne({ groupLink }).exec();
  return r;
};
