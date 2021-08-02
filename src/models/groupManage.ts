import {model, Schema} from "mongoose";

interface GROUPS {
  groupID: string;
  userId: Number;
  groupName: string;
  groupLink: string;
  groupDescription: string;
  groupCat: number;
  groupType: string;
  confirmed: boolean;
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
  confirmed: {
    type: Boolean,
  }
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
  const groupAdd = new GROUP({ groupID: groupID, userId: userId, groupName: groupName, groupLink: groupLink, groupDescription: groupDescription, groupCat: groupCat, groupType: groupType, confirmed: false })
  groupAdd.save(function (err: any) {
    if (err) return console.error(err);
    console.log("Group Saved!")
  });
}

export const getGroupID = async (groupID: number) => {
  return await GROUP.findOne({groupID}).exec();
};
export const getGroupLink = async (groupLink: string) => {
  const r = await GROUP.countDocuments({groupLink}).exec();
  console.log("R " + r + " String: " + groupLink)
  const test1 = r<1
  const test2= r>1
  const test3= r<0
  console.log("Test: " + test1 + " 2: " + test2 + " 3: " +test3)
  return r > 1;
};
