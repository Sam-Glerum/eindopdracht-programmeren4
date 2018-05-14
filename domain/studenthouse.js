class StudentHouse {
    constructor(name, street, houseNumber, postCode, city, userId) {
        this._id = id;
        this.owner = userId;
        this._name = name;
        this._street = street;
        this._houseNumber = houseNumber;
        this._postCode = postCode;
        this._city = city;
        this._userId = userId;
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get street() {
        return this._street;
    }

    set street(value) {
        this._street = value;
    }

    get houseNumber() {
        return this._houseNumber;
    }

    set houseNumber(value) {
        this._houseNumber = value;
    }

    get postCode() {
        return this._postCode;
    }

    set postCode(value) {
        this._postCode = value;
    }

    get city() {
        return this._city;
    }

    set city(value) {
        this._city = value;
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }
}