-- LEVEL 3: Reverse Engineer - Customer Order Summary

SELECT Customers.CustomerName,
       COUNT(Orders.OrderID) AS OrderCount,
       MIN(Orders.OrderDate) AS FirstOrder,
       MAX(Orders.OrderDate) AS LastOrder
FROM Customers
INNER JOIN Orders ON Customers.CustomerID = Orders.CustomerID
GROUP BY Customers.CustomerName
ORDER BY COUNT(Orders.OrderID) DESC;


-- This query will produce the exact format shown in the assignment:
-- - CustomerName: The name of the customer
-- - OrderCount: Total number of orders placed by that customer
-- - FirstOrder: Date of their first order
-- - LastOrder: Date of their most recent order
-- - Results ordered by order count (descending) then by customer name