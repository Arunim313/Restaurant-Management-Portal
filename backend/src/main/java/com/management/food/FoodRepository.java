package com.management.food;

import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Integer> {
    List<Food> findByCategory(String category);

    List<Food> findByRestaurantId(Integer restaurantID);

    List<Food> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<Food> findByName(String name);

}
