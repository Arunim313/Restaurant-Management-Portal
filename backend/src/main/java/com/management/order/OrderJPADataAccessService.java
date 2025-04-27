package com.management.order;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("order-jpa")
public class OrderJPADataAccessService implements OrderDAO {
    private final OrderRepository orderRepository;

    public OrderJPADataAccessService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @Override
    public Order add(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order update(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getOrdersByCustomerId(Integer customerId) {
        return orderRepository.findByCustomer_Id(customerId);
    }

    @Override
    public List<Order> getOrdersByRestaurantId(Integer restaurantId) {
        return orderRepository.findByRestaurant_Id(restaurantId);
    }

    @Override
    public boolean existsById(Integer orderId) {
        return orderRepository.existsById(orderId);
    }

    @Override
    public Optional<Order> getById(Integer id) {
        return orderRepository.findById(id);
    }

    @Override
    public void delete(Order order) {
        orderRepository.delete(order);
    }
}
