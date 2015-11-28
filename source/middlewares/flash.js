function setFlash(req, res, next) {
	res.locals = {
		notice: req.flash('notice'),
		success: req.flash('success'),
		error: req.flash('error')
	}
	next();
}

module.exports = setFlash;