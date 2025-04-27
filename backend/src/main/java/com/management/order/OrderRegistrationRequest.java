package com.management.order;

import com.management.food.Food;
import com.management.customer.Customer;

import java.util.List;

public record OrderRegistrationRequest(
        Customer customer, List<Food> foods, String address, Order.DeliveryType deliveryType
) {
}
