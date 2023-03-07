import createError from "../utils/createError.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";

const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, "Seller can't create a review"));
  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });
  try {
    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });
    if (review)
      next(createError(403, "You are already create a review for this Gig!"));

    //TODO: check if the user purchased the gig.

    const savedReview = await newReview.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });

    res.status(201).send(savedReview);
  } catch (error) {
    next(error);
  }
};

const getReview = async (req, res, next) => {
  try {
    const review = await Review.find({ gigId: req.params.gigId });
    res.status(200).send(review);
  } catch (error) {
    next(error);
  }
};
const deleteReview = async (req, res, next) => {
  try {
    res.send("delete review");
  } catch (error) {
    next(error);
  }
};

export { createReview, getReview, deleteReview };
