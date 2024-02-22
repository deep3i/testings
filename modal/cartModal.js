const mongoose = require('mongoose');

// Define the cart item schema
const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User model
});

// Create the cart item model
const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
