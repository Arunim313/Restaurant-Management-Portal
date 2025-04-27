package com.management.order;

import com.management.customer.Customer;
import com.management.customer.CustomerDAO;
import com.management.exception.NotValidResourceException;
import com.management.exception.ResourceNotFoundException;
import com.management.food.Food;
import com.management.food.FoodDAO;
import com.management.restaurant.Restaurant;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private final OrderDAO orderDAO;
    private final FoodDAO foodDAO;
    private final CustomerDAO customerDAO;


    public OrderService(@Qualifier("order-jpa") OrderDAO orderDAO, FoodDAO foodDAO, CustomerDAO customerDAO) {
        this.orderDAO = orderDAO;
        this.foodDAO = foodDAO;
        this.customerDAO = customerDAO;
    }

    public Order getById(Integer id) {
        return orderDAO.getById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order with id [%s] not found".formatted(id))
                );
    }

    public List<Order> getAll() {
        return orderDAO.getAll();
    }

    public List<Order> getOrdersByCustomerId(Integer customerId) {
        return orderDAO.getOrdersByCustomerId(customerId);
    }

    public List<Order> getOrdersByRestaurantId(Integer restaurantId) {
        return orderDAO.getOrdersByRestaurantId(restaurantId);
    }

    public Order add(OrderRegistrationRequest orderRegistrationRequest) {
        if (orderRegistrationRequest.customer() == null || orderRegistrationRequest.foods() == null ||
                orderRegistrationRequest.address() == null || orderRegistrationRequest.deliveryType() == null) {
            throw new NotValidResourceException("Missing data");
        }

        Integer customerId = orderRegistrationRequest.customer().getId();
        Customer customer = customerDAO.getById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id [%s] not found".formatted(customerId)));

        // Check for existing pending orders
        List<Order> customerOrders = orderDAO.getOrdersByCustomerId(customerId);
        boolean hasPendingOrder = customerOrders.stream()
                .anyMatch(order -> order.getStatus() == Order.OrderStatus.PENDING);
        
        if (hasPendingOrder) {
            throw new NotValidResourceException(
                "You already have a pending order. Please complete or cancel your existing order before placing a new one."
            );
        }

        List<Food> foods = new ArrayList<>();
        Restaurant restaurant = null;
        
        for (Food food : orderRegistrationRequest.foods()) {
            Integer foodId = food.getId();
            Food foodFromDb = foodDAO.getById(foodId)
                    .orElseThrow(() -> new ResourceNotFoundException("Food with id [%s] not found".formatted(foodId)));
            
            // Ensure the restaurant relationship is loaded
            if (foodFromDb.getRestaurant() == null) {
                throw new NotValidResourceException("Food with id [%s] has no restaurant association".formatted(foodId));
            }
            
            // Set restaurant from the first food item
            if (restaurant == null) {
                restaurant = foodFromDb.getRestaurant();
            }
            
            foods.add(foodFromDb);
        }

        if (restaurant == null) {
            throw new NotValidResourceException("No valid restaurant found in the order");
        }

        var address = orderRegistrationRequest.address();
        var deliveryType = orderRegistrationRequest.deliveryType();

        Order order = new Order(customer, foods, address, deliveryType);
        order.setRestaurant(restaurant);
        return orderDAO.add(order);
    }


    public Order updateOrder(Integer id, OrderUpdateRequest orderUpdateRequest) {
        Order order = getById(id);

        if (orderUpdateRequest.foods() != null) {
            List<Food> foods = new ArrayList<>();
            for (Food food : orderUpdateRequest.foods()) {
                Integer foodId = food.getId();
                Food foodFromDb = foodDAO.getById(foodId)
                        .orElseThrow(() -> new ResourceNotFoundException("Food with id [%s] not found".formatted(foodId)));
                
                // Ensure the restaurant relationship is loaded
                if (foodFromDb.getRestaurant() == null) {
                    throw new NotValidResourceException("Food with id [%s] has no restaurant association".formatted(foodId));
                }
                
                foods.add(foodFromDb);
            }
            order.setFoods(foods);
        }

        if (orderUpdateRequest.address() != null) {
            order.setAddress(orderUpdateRequest.address());
        }

        if (orderUpdateRequest.deliveryType() != null) {
            order.setDeliveryType(orderUpdateRequest.deliveryType());
        }

        if (orderUpdateRequest.status() != null) {
            order.setStatus(orderUpdateRequest.status());
        }

        return orderDAO.update(order);
    }

    public void deleteOrder(Integer id) {
        Order order = orderDAO.getById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Order with id [%s] not found".formatted(id)));
        
        orderDAO.delete(order);
    }
}