# Restaurant-Management-Portal

A full-stack restaurant management application built with Java Spring Boot (backend) and React.js (frontend).
It handles customers, restaurants, food items, orders, and payments.


### Technologies & Tools Used

- Java 17

- Maven

- Spring Boot 3

- Spring Data JPA

- PostgreSQL Database

## Demo Video
[![Watch the video](https://youtu.be/TKguHmWOLRo)](https://youtu.be/TKguHmWOLRo)


## Requests:

| Endpoints                                   | Description                                              |
|---------------------------------------------|----------------------------------------------------------|
| **Customers**                               |                                                          |
| `GET /api/v1/customers`                     | Retrieves all customers                                  |
| `GET /api/v1/customers/{id}`                | Retrieves the customer with the specified ID             |
| `POST /api/v1/customers`                    | Adds a new customer                                      |
| `PUT /api/v1/customers/{id}`                | Updates the customer with the specified ID               |
| `DELETE /api/v1/customers/{id}`             | Deletes the customer with the specified ID               |
| **Restaurants**                             |                                                          |
| `GET /api/v1/restaurants`                    | Retrieves all restaurants                                |
| `GET /api/v1/restaurants/{id}`               | Retrieves the restaurant with the specified ID           |
| `GET /api/v1/restaurants/district/{district}`| Retrieves restaurants in the specified district          |
| `GET /api/v1/restaurants/name/{name}`        | Retrieves restaurants with the specified name            |
| `POST /api/v1/restaurants`                   | Adds a new restaurant                                    |
| `PUT /api/v1/restaurants/{id}`               | Updates the restaurant with the specified ID             |
| `DELETE /api/v1/restaurants/{id}`            | Deletes the restaurant with the specified ID             |
| **Food**                                     |                                                          |
| `GET /api/v1/food`                           | Retrieves all available food                             |
| `GET /api/v1/food/{id}`                      | Retrieves the food with the specified ID                 |
| `GET /api/v1/food/name/{name}`               | Retrieves food with the specified name                   |
| `GET /api/v1/food/category/{category}`       | Retrieves food with the specified category               |
| `GET /api/v1/food/type/vegetarian`           | Retrieves all vegetarian food                            |
| `GET /api/v1/food/restaurant/{restaurant_id}`| Retrieves food for the specified restaurant              |
| `GET /api/v1/food/price-range`               | Retrieves food within the specified price range          |
| `POST /api/v1/food`                          | Adds new food to the database                            |
| `PUT /api/v1/food/{id}`                      | Updates the food with the specified ID                   |
| `DELETE /api/v1/food/{id}`                   | Deletes the food with the specified ID                   |
| **Orders**                                   |                                                          |
| `GET /api/v1/orders`                         | Retrieves all orders                                     |
| `GET /api/v1/orders/{id}`                    | Retrieves the order with the specified ID                |
| `GET /api/v1/orders/customer/{customerId}`   | Retrieves orders for the specified customer              |
| `GET /api/v1/orders/restaurant/{restaurantId}`| Retrieves orders for the specified restaurant           |
| `POST /api/v1/orders`                        | Adds a new order                                         |
| `PUT /api/v1/orders/{id}`                    | Updates the order with the specified ID                  |
| **Payments**                                 |                                                          |
| `GET /api/v1/payments`                       | Retrieves all payments                                   |
| `GET /api/v1/payments/{id}`                  | Retrieves the payment with the specified ID              |
| `POST /api/v1/payments`                      | Adds a new payment                                       |



### Example JSON for POST/PUT requests:

#### Customers
```json
{
  "firstname": "Arunim",
  "lastname": "Malviya",
  "email": "arunim@gmail.com",
  "address": "Shillong",
  "phoneNumber": "+91 123456789",
  "password": "abcd1234",
  "role": "CUSTOMER"
}
```

#### Restaurants
```json
{
  "name": "Hafees",
  "description": "Indian restaurant",
  "address": "Old Palasia",
  "district": "Indore",
  "phoneNumber": "+731 8899571",
  "ownerId": 3
}
```

#### Food
```json
{
  "restaurant": {"id":"1"},
  "name": "Chicken Noodles",
  "description": "Smoky chicken noodles ",
  "category": "Chinese",
  "price": 5.00,
  "isVegetarian": false
}
```

#### Orders
```json
{
  "customer": {"id": 1},
  "foods": [
    {"id": 24},
    {"id": 21}
  ],
  "address": "MR 10 Square",
  "deliveryType": "SHIPPING"
}
```

#### Payments
```json
{
  "order": {
    "id": 1
  },
  "paymentMethod": "CASH"
}
```
