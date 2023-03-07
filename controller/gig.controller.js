import createError from "../utils/createError.js";
import Gig from "../models/gig.model.js";

const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only Seller can create Gig!"));

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (error) {
    next(error);
  }
};

const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your Gig"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted");
  } catch (error) {
    next(error);
  }
};

const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.cat && { cat: q.cat }),
    ...(q.userId && { userId: q.userId }),
    // ...(q.price && { price: { $gt: q.price } }),
    ...((q.min || q.max) && {
      price: { ...(q.min && { $gt: q.min }), ...(q.max && { $lt: q.max }) },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };

  try {
    const gig = await Gig.find(filters).sort({ [q.sort]: -1 });
    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

export { createGig, deleteGig, getGig, getGigs };
