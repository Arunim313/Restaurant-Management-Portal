package com.management.customer;

public record CustomerRegistrationRequest(
        String firstname,
        String lastname,
        String email,
        String address,
        String phoneNumber,
        String password,
        UserRole role
) {}
