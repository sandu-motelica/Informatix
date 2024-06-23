import { Tag } from "../models/tagModel.js";
import { ProblemTags } from "../models/problemTagsModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";

export const getTags = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const tags = await Tag.find({}).lean();

    const problemTags = await ProblemTags.find({})
      .populate("id_problem")
      .lean();
    const filteredProblemTags = problemTags.filter(
      (item) => item?.id_problem?.status === "approved"
    );

    // console.log("problemTags", filteredProblemTags);
    const counter = new Map();

    filteredProblemTags.forEach((item) => {
      const tag_id = item.id_tag.toString();
      if (counter.has(tag_id)) {
        const counterVal = counter.get(tag_id) + 1;
        counter.set(tag_id, counterVal);
      } else {
        counter.set(tag_id, 1);
      }
    });

    tags.forEach((tag) => (tag.count = counter.get(tag._id.toString()) || 0));

    res.statusCode = 200;
    res.end(JSON.stringify(tags));
  } catch (e) {
    errorMiddleware(res, e);
  }
};

export const getProblemTag = async (req, res) => {
  try {
    const data = queryParams(req);
    // console.log("datax", data);
  } catch (e) {
    // console.log("eeee", e);
    errorMiddleware(res, e);
  }
};

export const addTag = async (req, res) => {
  try {
    await authMiddleware(req, res);
    const body = JSON.parse(req.data);
    const { name } = body;
    const tag = await Tag.create({ name });
    res.statusCode = 200;
    res.end(JSON.stringify(tag));
  } catch (e) {
    errorMiddleware(res, e);
  }
};
