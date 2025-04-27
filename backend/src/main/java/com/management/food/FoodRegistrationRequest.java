package com.management.food;

import com.management.restaurant.Restaurant;

public record FoodRegistrationRequest(
        Restaurant restaurant, String name, String description, String category, double price, boolean isVegetarian
) {
}
