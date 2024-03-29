const Campground = require('../models/campground');
const {cloudinary} = require('../api/cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
};

module.exports.createCamp = async (req, res) => {  
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.author = req.user._id;
    console.log(camp)
    await camp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`)
};

module.exports.showCamp = async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {camp})
};

module.exports.renderEditForm = async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    if (!camp) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp})
}

module.exports.updateCamp = async (req, res) => {
    const {id} = req.params
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    camp.images.push(...imgs)
    await camp.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${camp._id}`)
};

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground has been deleted')
    res.redirect('/campgrounds');
}