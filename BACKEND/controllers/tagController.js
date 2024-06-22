import { Tag } from "../models/tagModel.js";
import { ProblemTags } from "../models/problemTagsModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";

export const getTags = async (req, res) => {
  try {
    // await authMiddleware(req, res);
    const tags = await Tag.find({}).lean();
    const tagIds = tags.map((tag) => tag._id);
    const counts = await ProblemTags.aggregate([
      { $match: { id_tag: { $in: tagIds } } },
      { $group: { _id: "$id_tag", count: { $sum: 1 } } },
    ]);

    tags.forEach((tag, index) => (tag.count = counts[index].count));

    console.log(tags);
    res.statusCode = 200;
    res.end(JSON.stringify(tags));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

// only for debugging
export const getProblemTag = async (req, res) => {
  try {
    // await authMiddleware(req, res);
    const problemTags = await ProblemTags.find({});
    res.statusCode = 200;
    res.end(JSON.stringify(problemTags));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
