class Meal {
    constructor(name, description, ingredients, allergy, price, userId, studentHouseId) {
        this._id = 0;
        this.owner = userId;
        this._name = name;
        this._description = description;
        this._ingredients = ingredients;
        this._allergy = allergy;
        this._price = price;
        this._studentHouseId = studentHouseId;

        var participantArray = [];
        this._participantArray.push(userId);
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get ingredients() {
        return this._ingredients;
    }

    set ingredients(value) {
        this._ingredients = value;
    }

    get allergy() {
        return this._allergy;
    }

    set allergy(value) {
        this._allergy = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get studentHouseId() {
        return this._studentHouseId;
    }

    set studentHouseId(value) {
        this._studentHouseId = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }


    get participantArray() {
        return this._participantArray;
    }

    set participantArray(value) {
        this._participantArray = value;
    }
}