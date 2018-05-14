class Participant {
    constructor(userId, studentHouseId, mealId) {
        this._userId = userId;
        this._studentHouseId = studentHouseId;
        this._mealId = mealId;
    }


    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get studentHouseId() {
        return this._studentHouseId;
    }

    set studentHouseId(value) {
        this._studentHouseId = value;
    }

    get mealId() {
        return this._mealId;
    }

    set mealId(value) {
        this._mealId = value;
    }
}