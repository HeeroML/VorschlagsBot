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
    telegramGroupID: number;
    likes: number;
}

const schema = new Schema<GROUPS>({
    groupID: {
        type: String,
        unique: true,
    },// @ts-ignore
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
    },
    telegramGroupID: {
        type: Number,
    },
    likes: {
        type: Number,
    }
});

const GROUP = model("Groups", schema);

export const createGroup = (groupID: string,
                            userId: Number,
                            groupName: string,
                            groupLink: string,
                            groupDescription: string,
                            groupCat: number,
                            groupType: string) => {
    const groupAdd = new GROUP({
        groupID: groupID,
        userId: userId,
        groupName: groupName,
        groupLink: groupLink,
        groupDescription: groupDescription,
        groupCat: groupCat,
        groupType: groupType,
        confirmed: false,
        telegramGroupID: 0,
        telegramMessageID: 0,
        likes: 0,
    })
    groupAdd.save(function (err: any) {
        if (err) return console.error(err);
        console.log("Group Saved!")
    });
}
export const likePressed = async (groupID: string) => {
    const update = {$inc: {likes: 1}};
    const groupData = await GROUP.findOneAndUpdate({groupID}, update).exec();
    // @ts-ignore
    return groupData.likes
};
export const getGroupID = async (groupID: number) => {
    // @ts-ignore
    return await GROUP.findOne({groupID}).exec();
};
export const getTelegramGroupID = async (groupID: number) => {
    // @ts-ignore
    return await GROUP.findOne({groupID}).exec();
};
export const getGroupLink = async (groupLink: string) => {
    const r = await GROUP.countDocuments({groupLink}).exec();
    return r > 0;
};
