const router = require("express").Router(); 
const Product = require('./modal/productModal');
const CartItem = require('./modal/cartModal');
const User = require('./modal/userModal');
const { connectDB } = require("./database");
const bcrypt = require("bcrypt")

// Route for adding multiple products
router.post('/products', async (req, res) => {
    try {
        // Assuming req.body is an array of product objects
        const products = req.body;

        const batchSize = 10; // Adjust batch size as needed

        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            await Product.insertMany(batch);
        }

        res.status(201).json({ message: 'Products inserted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route for fetching all products with sorting and pagination
router.get('/products', async (req, res) => {
    connectDB();
    try {
        // Extract query parameters for sorting and pagination
        const { _sort, _order, _page, _limit } = req.query;

        // Convert _page and _limit to numbers
        const page = parseInt(_page) || 1;
        const limit = parseInt(_limit) || 10;

        // Calculate the number of items to skip
        const skip = (page - 1) * limit;

        // Define sorting order based on _order parameter
        const sortOrder = (_order === 'desc') ? -1 : 1;

        // Fetch products from the database with sorting and pagination
        const products = await Product.find()
            .sort({ [_sort]: sortOrder })
            .skip(skip)
            .limit(limit);

        // Return the products as a JSON response
        res.status(200).json(products);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Route for fetching a product by ID
router.get('/products/:productId', async (req, res) => {
    connectDB();
    try {
        // Extract the productId from the request parameters
        const productId = req.params.productId;

        // Find the product by its ID in the database
        const product = await Product.findById(productId);

        // If product is found, return it as a JSON response
        if (product) {
            res.status(200).json(product);
        } else {
            // If product is not found, return a 404 Not Found error
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for user signup
router.post('/signup', async (req, res) => {
    connectDB()
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    connectDB()
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.status(200).json({ message: 'Login successful', user_id: user?._id });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/cart', async (req, res) => {
    connectDB();
    try {
        const { userId, productId, quantity } = req.body;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create a new cart item
        const newCartItem = new CartItem({ productId, quantity, userId });
        await newCartItem.save();

        res.status(201).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for retrieving cart items for a user
router.get('/cart/:userId', async (req, res) => {
    connectDB();
    try {
        const { userId } = req.params;

        // Find cart items for the user
        const cartItems = await CartItem.find({ userId }).populate('productId');

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for deleting a cart item for a user
router.delete('/cart', async (req, res) => {
    connectDB();
    try {
        const { userId, cartItemId } = req.body;

        // Check if the cart item exists for the user
        const cartItem = await CartItem.findOne({ _id: cartItemId, userId });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Delete the cart item
        await CartItem.findByIdAndDelete(cartItemId);

        res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router