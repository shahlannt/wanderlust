const Listing = require('../models/listing')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const ExpressError = require('../utils/ExpressError');
const mapToken = process.env.MAP_TOKEN;
geocodingClient = mbxGeocoding({accessToken: mapToken});

module.exports.index = async(req, res) => {
    const selectedCategory = typeof req.query.category === 'string' ? req.query.category : '';
    const searchQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const filter = {};
    if (selectedCategory) filter.category = selectedCategory;
    if (searchQuery) {
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escapedQuery, 'i');
        filter.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex }
        ];
    }
    const listings = await Listing.find(filter);
    res.render('listings/index.ejs', { listings, selectedCategory, searchQuery });
};

//create new listing form

module.exports.newForm = async (req, res) => {
    res.render('listings/new.ejs');
}

//view listing

module.exports.viewListing = async (req, res,next) => {
        const { id } = req.params;
        const listing = await Listing.findById(id)
        .populate({path :'reviews',
             populate : {path :"author"}})
             .populate('owner');
        if (!listing) {
            req.flash('error', 'Listing not found!');
            return res.redirect('/listings');
        }
        res.render('listings/show.ejs', { listing });

}


// create new listing 
module.exports.createNew = async (req, res,next) => {
        let url = req.file.path;
        let filename = req.file.filename;
        const { title, description, image,category, location, price, country } = req.body;

        let response = await geocodingClient
        .forwardGeocode({
            query:location ,
            limit: 1
            })
            .send();            
        
        const newListing = new Listing({ title, description, image: { filename ,url },category, location, price, country, owner: req.user._id });
        newListing.geometry = response.body.features[0].geometry;
        await newListing.save();
        req.flash('success', 'New listing created!');
        res.redirect('/listings');
   
}


// edit form

module.exports.editForm = async (req, res,next) => {
    const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash('error', 'Listing not found!');
            return res.redirect('/listings');
        }
        
        res.render('listings/edit.ejs', { listing });
    
}

//update listing

module.exports.updateListing = async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash('error', 'Listing not found!');
            return res.redirect('/listings');
        }

        const { title, description, category, location, price, country } = req.body;
        const updateData = {
            title,
            description,
            category,
            location,
            price,
            country
        };

        if (location !== listing.location || country !== listing.country) {
            const response = await geocodingClient
                .forwardGeocode({
                    query: `${location}, ${country}`,
                    limit: 1
                })
                .send();

            const geometry = response.body.features[0]?.geometry;
            if (!geometry) {
                throw new ExpressError(400, 'Could not find map coordinates for that location and country.');
            }
            updateData.geometry = geometry;
        }

        if (req.file) {
            updateData.image = {
                filename: req.file.filename,
                url: req.file.path
            };
        }

        await Listing.findByIdAndUpdate(id, updateData);

        req.flash('success', 'Listing updated successfully!');
        res.redirect(`/listings/${id}`);
    }

//delete Listing

module.exports.deleteListing = async (req, res,next) => {
    const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash('success', 'Listing deleted successfully!');
        res.redirect('/listings');
   
}