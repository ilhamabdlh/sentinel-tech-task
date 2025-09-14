-- Countries with most customers (minimum 5 customers)
SELECT 
    Country, 
    COUNT(CustomerID) as customer_count
FROM Customers
GROUP BY Country
HAVING COUNT(CustomerID) >= 5
ORDER BY customer_count DESC;

-- Expected results:
-- USA: 13 customers
-- Germany: 11 customers  
-- France: 11 customers
-- Brazil: 9 customers
-- UK: 7 customers
-- Spain: 5 customers
-- Mexico: 5 customers