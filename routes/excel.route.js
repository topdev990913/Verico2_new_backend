let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router()
const multer = require('multer');
var xlsx = require('node-xlsx');
const factor = require('../config/factor.constants');
const scope = require('../config/scope.emission');


const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './uploads/');
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage }).single('csv');

const isNumber = (str) => /^\d+$/.test(str);

const getNumber = (str) => {
    if (!isNumber(str)) {
        const number = parseFloat(str.replace(/,/g, ""));
        return isNaN(number) ? null : number;
    }
    return parseFloat(str, 10);
};
// CREATE User
router.route('/create-student').post((req, res, next) => {
    userSchema.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log("data", data)
            res.json(data)
        }
    })
})
// get factor list
router.route('/load-factor').get((req, res) => {
    // const factor = false;
    return res.send(factor)
})

// get scope list 
router.route('/load-scope').get((req, res) => {
    // const factor = false;
    return res.send(scope)
})


//Uploading CSV
router.route('/read-file').post((req, res) => {
    upload(req, res, function (err, file) {
        if (err) {
            return res.status(500).send({
                message: err.message
            })
        }
        console.log(req.file.path)
        var obj = xlsx.parse(req.file.path); // parses a file
        console.log("data", JSON.stringify(obj))
        let data = obj[0].data;
        let f = 0;
        let data_ = [], data__ = [];
        for (i in data) {
            let record = data[i];
            console.log(record.length)
            if (record.length == 0) {
                f = 0;
                if (data_.length) {
                    data__.push(data_)
                    data_ = []
                }
            }
            else if (`${record[0]}`.includes('Category')) {
                f = 1;
            }
            if (f) {
                let arr = [];
                for (let j in record) {
                    let number = getNumber(`${record[j]}`)
                    if (number)
                        arr.push(number);
                }
                if (arr.length > 1)
                    data_.push(arr);
            }
        }
        console.log('------', data__)
        res.send({ data: data__ });
    })
})

router.route('/read-fileCSV').post((req, res) => {
    upload(req, res, function (err, file) {
        if (err) {
            return res.status(500).send({
                message: err.message
            })
        }
        console.log(req.file.path)
        // var obj = xlsx.parse(req.file.path); // parses a file
        // console.log("data", JSON.stringify(obj))
        // let data = obj[0].data;
        // let f = 0;
        // let data_ = [], data__ = [];
        // for (i in data) {
        //     let record = data[i];
        //     console.log(record.length)
        //     if (record.length == 0) {
        //         f = 0;
        //         if (data_.length) {
        //             data__.push(data_)
        //             data_ = []
        //         }
        //     }
        //     else if (`${record[0]}`.includes('Category')) {
        //         f = 1;
        //     }
        //     if (f) {
        //         let arr = [];
        //         for (let j in record) {
        //             let number = getNumber(`${record[j]}`)
        //             if (number)
        //                 arr.push(number);
        //         }
        //         if (arr.length > 1)
        //             data_.push(arr);
        //     }
        // }
        // console.log('------', data__)
        // res.send({ data: data__ });
    })
})
module.exports = router
