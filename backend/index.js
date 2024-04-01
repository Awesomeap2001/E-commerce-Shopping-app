import express from "express";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config()


const PORT = process.env.PORT || 4000;


// Databse Connection With MongoDB
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL)


// API creation
app.get('/', (req, res) => {
    res.send("Express App is Running")
})


// Image Storage Engine
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })


// Creating Upload Endpoint for Images
app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    })
})


// Schema for Creating Products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
})

// Add Product
app.post("/addproduct", async (req, res) => {
    const { name, image, category, new_price, old_price } = req.body

    // Automatically generating Id
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1
    }
    else {
        id = 1
    }

    // Creating new Product using Schema
    const product = new Product({
        id: id,
        name,
        image,
        category,
        new_price,
        old_price
    });
    console.log(product);

    // Storing the Product in MongoDB
    await product.save();
    console.log("Product Saved")

    res.json({
        success: true,
        name: req.body.name
    })
})


// Delete Product / Remove Product
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Product Removed")

    res.json({
        success: true,
        name: req.body.name
    })
})


// Get All Products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched")
    res.send(products);
})




// *********************************************************************************************************
// E-commerce Frontend 

// Schema Creating for User Model
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// Register User
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body
    const checkExistingUser = await Users.findOne({ email })
    if (checkExistingUser) {
        return res.status(400).json({ success: false, errors: "Email already Exists" })
    }

    let cart = {}
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const user = new Users({ name, email, password, cartData: cart })

    await user.save();

    const data = {
        user: { id: user.id }
    }

    const token = jwt.sign(data, 'secret_key_ecommerce')
    res.json({ success: true, token })
})


// Login User
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    let user = await Users.findOne({ email });
    if (!user) {
        return res.json({ success: false, errors: "User does not Exist" })
    }

    if (password === user.password) {
        const data = {
            user: { id: user.id }
        }

        const token = jwt.sign(data, 'secret_key_ecommerce')
        res.json({ success: true, token })
    }
    else {
        res.json({ success: false, errors: "Incorrect Password" })
    }
})


// New Collection data
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({})
    let newcollection = products.slice(1).slice(-8)
    console.log("New collection Fetched");
    res.send(newcollection);
})


// Popular in Men
app.get("/popular", async (req, res) => {
    let products = await Product.find({ category: "men" })
    let popular = products.slice(0, 4);
    console.log("Popular in Men Fetched")
    res.send(popular);
})

// Middleware to fetch User
const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token")
    if (!token) {
        res.status(401).send({ errors: "Please Authenticate using Valid Token" })
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_key_ecommerce')
            req.user = data.user
            next();
        } catch (error) {
            res.status(401).send({ errors: "Please Authenticate using Valid Token" })
            // console.log(error)
        }
    }
}

// Add to Cart
app.post("/addtocart", fetchUser, async (req, res) => {
    // console.log(req.body, req.user);
    console.log("Added ", req.body.itemId);
    const user = await Users.findOne({ _id: req.user.id })
    user.cartData[req.body.itemId] += 1
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: user.cartData })
    res.send({ message: "Added to Cart" })
})


// Remove from Cart
app.post("/removefromcart", fetchUser, async (req, res) => {
    // console.log(req.body, req.user);
    console.log("Removed ", req.body.itemId);
    const user = await Users.findOne({ _id: req.user.id })
    if (user.cartData[req.body.itemId] > 0) {
        user.cartData[req.body.itemId] -= 1
    }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: user.cartData })
    res.send({ message: "Removed to Cart" })
})


// Get Cart Data
app.post("/getcart", fetchUser, async (req, res) => {
    console.log("Get Cart")
    const user = await Users.findOne({ _id: req.user.id })
    res.json(user.cartData);
})


app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running on PORT - ${PORT}`)
    }
    else {
        console.log("Error :", error)
    }
})