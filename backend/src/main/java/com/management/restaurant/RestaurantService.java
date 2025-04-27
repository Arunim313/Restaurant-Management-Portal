package com.management.restaurant;

import com.management.customer.CustomerDAO;
import com.management.customer.UserRole;
import com.management.exception.ResourceNotFoundException;
import com.management.exception.UnauthorizedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RestaurantService {
    private final RestaurantDAO restaurantDAO;
    private final CustomerDAO customerDAO;

    public RestaurantService(RestaurantDAO restaurantDAO, CustomerDAO customerDAO) {
        this.restaurantDAO = restaurantDAO;
        this.customerDAO = customerDAO;
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantDAO.getAllRestaurants();
    }

    public Restaurant getRestaurantById(Integer id) {
        return restaurantDAO.getRestaurantById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Restaurant with id [%s] not found".formatted(id))
                );
    }

    public List<Restaurant> getRestaurantsByName(String name) {
        return restaurantDAO.findByName(name);
    }

    public Restaurant getRestaurantsByDistrict(String district) {
        return restaurantDAO.getRestaurantByDistrict(district)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Restaurants from district [%s] not found".formatted(district))
                );
    }

    public void addRestaurant(RestaurantRegistrationRequest request) {
        customerDAO.getById(request.ownerId())
                .filter(customer -> customer.getRole() == UserRole.OWNER)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Owner with id [%s] not found or not an owner".formatted(request.ownerId())));

        Restaurant restaurant = new Restaurant(
                request.name(),
                request.description(),
                request.address(),
                request.district(),
                request.phoneNumber(),
                request.ownerId()
        );
        restaurantDAO.addRestaurant(restaurant);
    }

    public void deleteRestaurant(Integer id, Integer ownerId) {
        Restaurant restaurant = restaurantDAO.getRestaurantById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Restaurant with id [%s] not found".formatted(id)));

        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException(
                "Owner with id [%s] is not authorized to delete this restaurant".formatted(ownerId));
        }

        restaurantDAO.deleteRestaurant(restaurant);
    }

    public void updateRestaurant(Integer id, RestaurantUpdateRequest request, Integer ownerId) {
        Restaurant restaurant = restaurantDAO.getRestaurantById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Restaurant with id [%s] not found".formatted(id)));

        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException(
                "Owner with id [%s] is not authorized to update this restaurant".formatted(ownerId));
        }

        if (request.name() != null) {
            restaurant.setName(request.name());
        }

        if (request.description() != null) {
            restaurant.setDescription(request.description());
        }

        if (request.address() != null) {
            restaurant.setAddress(request.address());
        }

        if (request.district() != null) {
            restaurant.setDistrict(request.district());
        }

        if (request.phoneNumber() != null) {
            restaurant.setPhoneNumber(request.phoneNumber());
        }

        restaurantDAO.updateRestaurant(restaurant);
    }

    public List<Restaurant> getRestaurantsByOwnerId(Integer ownerId) {
        // Verify owner exists
        customerDAO.getById(ownerId)
                .filter(customer -> customer.getRole() == UserRole.OWNER)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Owner with id [%s] not found or not an owner".formatted(ownerId)));

        return restaurantDAO.findByOwnerId(ownerId);
    }
}
