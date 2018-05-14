class Meal {
    constructor(name, description, ingredients, allergy, price, userId, studentHouseId) {
        this.id = 0;
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.allergy = allergy;
        this.price = price;
        this.userId = userId;
        this.studentHouseId = studentHouseId;
        this.owner = userId;
    }
}