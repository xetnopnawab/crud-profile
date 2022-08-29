const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads');
  },
  filename: function (req, file, cb) {
    let modifiedfilename = `nawab-${Date.now()+path.extname(file.originalname)}`;
    cb(null, modifiedfilename);
  }
});

let upload = multer({
    storage:storage,
    fileFilter: function fileFilter (req, file, cb) {
        let filetypes = /png|jpg|jpeg|svg|gif/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            if(mimetype && extname) return cb(null, true);
        cb('Only '+ filetypes + ' are accepted!');
      }
});

module.exports = upload;