const Phorestaurant = require('../models/phorestaurant');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const phorestaurant = await Phorestaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    phorestaurant.reviews.push(review);
    await review.save();
    await phorestaurant.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/phorestaurants/${phorestaurant._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Phorestaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/phorestaurants/${id}`);
}
