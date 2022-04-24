/* DONT CHANGE THIS CODE - START */
function wait(ms = 1000) { return new Promise(resolve => setTimeout(resolve, ms)) }

class Dish {
    constructor(cookingTime) {
        this.cookingTime = cookingTime;
    }

    async cook() {
        const actualCookingTime = this.cookingTime * (1 + Math.random()) * 100;
        await wait(actualCookingTime);
        return this;
    }
}
/* DONT CHANGE THIS CODE - END */

/* YOUR CODE HERE */

class Kitchen {
    fridge = [];
    orders = [];

    addToFridge(newIngridients) {
        for (let newIngridient of newIngridients) {
            let foundIngridient = this.checkFridge(newIngridient);
            if (!foundIngridient) {
                this.fridge.push(newIngridient);
            } else {
                // if ingridient is already present in the fridge, increase it's amount
                foundIngridient.changeAmount(newIngridient.amount);
            }
        }
    }
    
    // check if specified product is in the fridge
    checkFridge(ingridient) {
        for (let fridgeIngridient of this.fridge) {
            if (ingridient.name == fridgeIngridient.name && fridgeIngridient.amount > 0) {
                return fridgeIngridient;
            }
        }
        return false;
    }

    order(order) {
        let ingridientsToBeUsed = [];
        // check if all needed ingridients are present
        for (let orderIngridient of order.ingridients) {
            let ingridientPresent = this.checkFridge(orderIngridient);
            if (!ingridientPresent) {
                // empty list of Ingidients to be used
                ingridientsToBeUsed = [];
                throw new Error('Not enough ingridients in fridge');
            } else {
                ingridientsToBeUsed.push(ingridientPresent);
            }
        }
        this.orders.push(order);
        // reduce amount of ingridient
        for (let ingridient of ingridientsToBeUsed) {
            ingridient.changeAmount(-1);
        }
    }

    cookFastestOrder() {
        if (this.orders.length == 0) {
            throw new Error('Order list is empty!');
        }
        let fastestOrder = this.orders[0];
        let fastestOrderId = 0;
        for (let i = 1; i < this.orders.length; i++) {
            if (fastestOrder.cookingTime > this.orders[i].cookingTime) {
                fastestOrder = this.orders[i];
                fastestOrderId = i;
            }
        }
        // remove that order from the list
        this.orders.splice(fastestOrderId, 1);
        fastestOrder.cook();
    }

    cookAllOrders() {
        let cookedOrders = [];
        if (this.orders.length == 0) {
            throw new Error('Order list is empty!');
        }
        for (let order of this.orders) {
            cookedOrders.push(order.cook());
        }
        // empty orders list
        this.orders = [];
        return cookedOrders;
    }
}


class Ingridient {
    name = '';
    amount = 0;

    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
    }

    changeAmount(changeBy) {
        if (changeBy > this.amount) {
            this.amount = 0;
        } else {
            this.amount += changeBy;
        }
    }
}


class Bolognese extends Dish {
    constructor() {
        super(10);
        this.ingridients = [new Ingridient('spaghetti', 0), 
                            new Ingridient('tomato', 0)];
    }
}


class MashedPotatoes extends Dish {
    constructor() {
        super(8);
        this.ingridients = [new Ingridient('potato', 0)];
    }
}


class Steak extends Dish {
    constructor() {
        super(7);
        this.ingridients = [new Ingridient('meat', 0)];
    }
}


class SteakAndFries extends Dish {
    constructor() {
        super(13);
        this.ingridients = [new Ingridient('meat', 0), 
                            new Ingridient('potato', 0)];
    }
}

/* YOUR CODE HERE */

async function test() {
    const kitchen = new Kitchen();
    kitchen.addToFridge([
        new Ingridient('potato', 1),
        new Ingridient('spaghetti', 1),
        new Ingridient('meat', 3),
        new Ingridient('tomato', 2)
    ])

    kitchen.order(new Bolognese()); // Bolognese extends Dish (cookingTime = 10)
    kitchen.order(new MashedPotatoes()); // MashedPotatoes extends Dish (cookingTime = 8)
    kitchen.order(new Steak()); // Steak extends Dish (cookingTime = 7)

    // Feel free to experiment with various dishes and ingridients

    await kitchen.cookFastestOrder(); // Returns fastest dish to make
    await kitchen.cookAllOrders(); // Returns two dishes in array

    console.log(kitchen)

    kitchen.order(new SteakAndFries()); // Throws Error: Not enough ingridients in fridge
}

test();
