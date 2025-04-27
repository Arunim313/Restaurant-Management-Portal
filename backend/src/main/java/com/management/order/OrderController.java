package com.management.order;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getOrders() {
        return orderService.getAll();
    }

    @GetMapping("{id}")
    public Order getOrder(@PathVariable("id") Integer id) {
        return orderService.getById(id);
    }

    @GetMapping("customer/{customerId}")
    public List<Order> getOrdersByCustomerId(@PathVariable("customerId") Integer customerId) {
        return orderService.getOrdersByCustomerId(customerId);
    }

    @GetMapping("restaurant/{restaurantId}")
    public List<Order> getOrdersByRestaurantId(@PathVariable("restaurantId") Integer restaurantId) {
        return orderService.getOrdersByRestaurantId(restaurantId);
    }

    @PostMapping
    public Order addOrder(@RequestBody OrderRegistrationRequest request) {
        return orderService.add(request);
    }

    @PutMapping("{id}")
    public Order updateOrder(@PathVariable("id") Integer id, @RequestBody OrderUpdateRequest request) {
        return orderService.updateOrder(id, request);
    }

    @DeleteMapping("{id}")
    public void deleteOrder(@PathVariable("id") Integer id) {
        orderService.deleteOrder(id);
    }
}