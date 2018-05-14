class User{
    constructor(firstName, lastName, email, password) {
        this._id = 0;
        this._isRegistered = false;
        this._isLoggedIn = false;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._password = password;
    }


    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get isRegistered() {
        return this._isRegistered;
    }

    set isRegistered(value) {
        this._isRegistered = value;
    }

    get isLoggedIn() {
        return this._isLoggedIn;
    }

    set isLoggedIn(value) {
        this._isLoggedIn = value;
    }
}