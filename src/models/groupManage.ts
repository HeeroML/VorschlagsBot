import {model, Schema} from "mongoose";

interface GROUPS {
  groupID: string;
  userId: Number;
  groupName: string;
  groupLink: string;
  groupDescription: string;
  groupCategorie: number;
  groupType: string;
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
    type: String,
  },
});

const GROUP = model("Groups", schema);

export const createGroup = ( groupID: string,
userId: Number,
groupName: string,
groupLink: string,
groupDescription: string,
groupCategorie: number,
groupType: string) =>
  GROUP.updateOne({}, { groupID, userId, groupName, groupLink, groupDescription, groupCategorie, groupType }, { upsert: true });

export const getGroupID = async (groupID: number) => {
  return await GROUP.findOne({groupID}).exec();
};
export const getGroupLink = async (groupLink: string) => {
  return await GROUP.findOne({groupLink}).exec();
};