# SQL Solutions

## Database Schema
Using Northwind Sample Database with the following tables:
- **Customers**: 91 records
- **Categories**: 8 records  
- **Employees**: 10 records
- **OrderDetails**: 518 records
- **Orders**: 196 records
- **Products**: 77 records
- **Shippers**: 3 records
- **Suppliers**: 29 records

## Solutions

### Level 1: Count German Customers
```sql
SELECT COUNT(*) as german_customers
FROM Customers 
WHERE Country = 'Germany';
```
**Result**: Returns count of customers from Germany

### Level 2: Countries with Most Customers (Min 5)
```sql
SELECT Country, COUNT(CustomerID) AS CustomerCount
FROM Customers
GROUP BY Country
HAVING COUNT(CustomerID) >= 5
ORDER BY COUNT(CustomerID) DESC;
```
**Expected Results** (7 records):
- USA: 13 customers
- Germany: 11 customers  
- France: 11 customers
- Brazil: 9 customers
- UK: 7 customers
- Spain: 5 customers
- Mexico: 5 customers

### Level 3: Customer Order Summary (Reverse Engineering)
```sql
SELECT Customers.CustomerName,
       COUNT(Orders.OrderID) AS OrderCount,
       MIN(Orders.OrderDate) AS FirstOrder,
       MAX(Orders.OrderDate) AS LastOrder
FROM Customers
INNER JOIN Orders ON Customers.CustomerID = Orders.CustomerID
GROUP BY Customers.CustomerName
ORDER BY COUNT(Orders.OrderID) DESC;
```
**Result**: Produces the exact format shown in assignment with CustomerName, OrderCount, FirstOrder, and LastOrder columns