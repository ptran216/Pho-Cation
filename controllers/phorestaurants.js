const Phorestaurant = require('../models/phorestaurant');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const phorestaurants = await Phorestaurant.find({}).populate('popupText');
    res.render('phorestaurants/index', { phorestaurants })
}

module.exports.renderNewForm = (req, res) => {
    res.render('phorestaurants/new');
}

module.exports.createPhorestaurant = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.phorestaurant.location,
        limit: 1
    }).send()
    const phorestaurant = new Phorestaurant(req.body.phorestaurant);
    phorestaurant.geometry = geoData.body.features[0].geometry;
    phorestaurant.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    phorestaurant.author = req.user._id;
    await phorestaurant.save();
    console.log(phorestaurant);
    req.flash('success', 'Successfully made a new pho restaurant!');
    res.redirect(`/phorestaurants/${phorestaurant._id}`)
}

module.exports.showPhorestaurant = async (req, res,) => {
    const phorestaurant = await Phorestaurant.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!phorestaurant) {
        req.flash('error', 'Cannot find that pho restaurant!');
        return res.redirect('/phorestaurants');
    }
    res.render('phorestaurants/show', { phorestaurant });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const phorestaurant = await Phorestaurant.findById(id)
    if (!phorestaurant) {
        req.flash('error', 'Cannot find that pho restaurant!');
        return res.redirect('/phorestaurants');
    }
    res.render('phorestaurants/edit', { phorestaurant });
}

module.exports.updatePhorestaurant = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const phorestaurant = await Phorestaurant.findByIdAndUpdate(id, { ...req.body.phorestaurant });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    phorestaurant.images.push(...imgs);
    await phorestaurant.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await phorestaurant.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated pho restaurant!');
    res.redirect(`/phorestaurants/${phorestaurant._id}`)
}

module.exports.deletePhorestaurant = async (req, res) => {
    const { id } = req.params;
    await Phorestaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted pho restaurant')
    res.redirect('/phorestaurants');
}