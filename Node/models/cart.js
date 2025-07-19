class Cart {
    constructor(oldCart) {
        this.items = oldCart.items || {};
        this.totalQty = Number(oldCart.totalQty || 0);
        this.totalPrice = Number(oldCart.totalPrice || 0);
    }

    add(item, id, amount) {
        amount = Number(amount);
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty += amount;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty += amount;
        this.totalPrice += storedItem.item.price * amount;
    };

    remove(id, amount) {
        amount = Number(amount);
        var storedItem = this.items[id];
        if (storedItem) {
            this.totalPrice -= storedItem.item.price * amount;
            storedItem.price -= storedItem.item.price * amount;
            storedItem.qty -= amount;
            this.totalQty -= amount;
            if (storedItem.qty <= 0) {
                delete this.items[id];
            }
        }
    }
}

module.exports = Cart;
