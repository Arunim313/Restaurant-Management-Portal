package com.management.food;

import com.management.restaurant.Restaurant;

public record FoodUpdateRequest(
        String name, String description, String category, double price, boolean isVegetarian, Restaurant restaurant
) {
}
