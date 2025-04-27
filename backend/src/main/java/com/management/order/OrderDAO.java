package com.management.order;

import java.util.List;
import java.util.Optional;

public interface OrderDAO {
    List<Order> getAll();

    Order add(Order order);

    Optional<Order> getById(Integer id);

    Order update(Order order);

    List<Order> getOrdersByCustomerId(Integer customerId);

    List<Order> getOrdersByRestaurantId(Integer restaurantId);

    boolean existsById(Integer orderId);

    void delete(Order order);
}