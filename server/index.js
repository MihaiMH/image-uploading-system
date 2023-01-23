///////////////////////////////////////////////

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();

var fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// const port = process.env.PORT || 3001;

app.listen(3001, () => {
    console.log("Server running on port 3001");
})
///////////////////////////////////////////////



////////////////////////////////////////////////

// Setting the storage

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, callback) => {
        callback(
            null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
});

const upload = multer({ storage: storage, limits: 1024 * 1024 * 5 });

////////////////////////////////////////////////


////////////////////////////////////////////////

// GET Requst for getting all images from the ./uploads directory

app.get('/getImages', async (req, res) => {
    console.log("getImages GET REQUEST")
    try {
        const images = await fs.promises.readdir(path.join('./uploads'));
        let temp = images;
        let imgs = [];
        temp.map((img) => {
            imgs.push("http://localhost:3001/uploads/" + img);
        })
        res.status(200).send(imgs);
    } catch (err) {
        console.log(err);
        res.status(500).send("ERROR");
    }
})


// POST Request for uploading an image

app.post('/uploadImage', upload.single("image"), async (req, res) => {
    console.log("uploadImage POST REQUEST")
    const file = req.file;
    try {
        console.log("Image uploaded successfully");
        res.status(200).send("SUCCESS");
    } catch (err) {
        console.log(err);
        res.status(500).send("ERROR");
    }
})


// POST Request for deleting an image

app.post('/deleteImage', async (req, res) => {
    console.log("deleteImage POST REQUEST");
    let file_name = req.body.file_name;
    let file = new String(file_name);

    file = file.replace("http://localhost:3001/", "");
    file = './' + file;

    try {
        fs.unlinkSync(file);
        console.log("Deleted " + file);
        res.status(200).send("SUCCESS");
    } catch (err) {
        console.log(err);
        res.status(500).send("ERROR")
    }

})


// POST Request for replacing an image

app.post('/replaceImage', upload.single("image"), async (req, res) => {
    console.log("replaceImage POST REQUEST");

    let file_name = req.body.file_name;
    let file = new String(file_name);

    file = file.replace("http://localhost:3001/", "");
    file = './' + file;

    try {
        fs.unlinkSync(file);
        console.log("Replaced file " + file);
        res.status(200).send("SUCCESS");
    } catch (err) {
        console.log(err);
        res.status(500).send("ERROR")
    }
})



/////////////////////////////////////////////////