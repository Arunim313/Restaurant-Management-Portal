package com.management.restaurant;

public record RestaurantRegistrationRequest(
        String name, String description, String address, String district, String phoneNumber,
        Integer ownerId
) {
}
