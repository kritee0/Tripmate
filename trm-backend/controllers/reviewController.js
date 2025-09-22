import Review from "../models/reviewModel.js";
import Place from "../models/PlaceModel.js";


const updatePlaceRating = async (placeId) => {
  const reviews = await Review.find({ placeId });
  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;

  await Place.findByIdAndUpdate(placeId, { averageRating, reviewCount });
};


export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ placeId: req.params.placeId }).populate(
      "user",
      "_id name"
    );
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};


export const addReview = async (req, res) => {
  try {
    const { placeId, rating, comment } = req.body;

    const newReview = new Review({
      placeId,
      user: req.user._id,
      rating,
      comment,
    });

    await newReview.save();

    const populatedReview = await Review.findById(newReview._id).populate(
      "user",
      "_id name"
    );

    await updatePlaceRating(placeId);

    res.status(201).json({ success: true, review: populatedReview });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message,
    });
  }
};


export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return res.status(404).json({ success: false, message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "_id name"
    );

    await updatePlaceRating(review.placeId);

    res.json({ success: true, review: populatedReview });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return res.status(404).json({ success: false, message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await review.deleteOne();
    await updatePlaceRating(review.placeId);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};
