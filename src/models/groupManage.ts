import {model, Schema} from "mongoose";

interface GROUPS {
  groupID: string;
  userId: Number;
  groupName: string;
  groupLink: string;
  groupDescription: string;
  groupCat: number;
  groupType: string;
}

const schema = new Schema<GROUPS>({
  groupID: {
    type: String,
    unique: true,
  },
  userId: {
    type: Number,
  },
  groupName: {
    type: String,
  },
  groupLink: {
    type: String,
  },
  groupDescription: {
    type: String,
  },
  groupCat: {
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
groupCat: number,
groupType: string) => {

console.log("Group Add called: " + groupID, userId, groupName, groupLink, groupDescription, groupCat, groupType)
  const groupAdd = new GROUP({ groupID: groupID, userId: userId, groupName: groupName, groupLink: groupLink, groupDescription: groupDescription, groupCat: groupCat, groupType: groupType })
  groupAdd.save(function (err: any) {
    if (err) return console.error(err);
    console.log("Group Saved!")
  });
}

export const getGroupID = async (groupID: number) => {
  return await GROUP.findOne({groupID}).exec();
};
export const getGroupLink = async (groupLink: string) => {
  return await GROUP.findOne({groupLink}).exec();
};
