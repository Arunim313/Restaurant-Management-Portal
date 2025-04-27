package com.management.payment;

import com.management.order.Order;

public record PaymentRegistrationRequest(
        Order order, Payment.PaymentMethod paymentMethod
) {
}
