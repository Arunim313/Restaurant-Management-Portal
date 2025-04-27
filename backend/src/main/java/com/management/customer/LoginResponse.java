package com.management.customer;

public class LoginResponse {
    private Customer customer;
    private String redirectUrl;

    public LoginResponse(Customer customer, String redirectUrl) {
        this.customer = customer;
        this.redirectUrl = redirectUrl;
    }

    public Customer getCustomer() {
        return customer;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }
} 