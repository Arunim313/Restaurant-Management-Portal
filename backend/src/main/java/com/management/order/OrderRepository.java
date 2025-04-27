package com.management.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findAll();

    Optional<Order> findById(Integer id);

    List<Order> findByCustomer_Id(Integer customerId);

    List<Order> findByRestaurant_Id(Integer restaurantId);
}
