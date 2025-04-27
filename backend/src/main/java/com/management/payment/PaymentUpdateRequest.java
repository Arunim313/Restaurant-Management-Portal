package com.management.payment;

public record PaymentUpdateRequest(
        Payment.PaymentStatus paymentStatus) {
}
