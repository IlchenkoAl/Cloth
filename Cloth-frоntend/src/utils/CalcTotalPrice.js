export default (cartItems) => {
    return cartItems ? cartItems.reduce((sum, item) => item.price + sum, 0) : 0
}