class User{
    constructor(firstName, lastName, email, password) {
        this.id = 0;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isRegistered = false;
        this.isLoggedIn = false;
    }
}