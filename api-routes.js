const multer=require('multer')
const upload=multer({
    dest:'./upload/image',

})
const auth=require('../middleware/auth')
let router = require('express').Router();
var contactController = require('../controller/contactController');;
router.route('/new',auth)
.post(contactController.new)

router.route('/login')
.post(contactController.login)

router.route('/sentMail')
.post(contactController.sentMail)

router.route('/upload')
.post(upload.single('profile'),contactController.uploadFile)

module.exports = router;



