-- LEVEL 1: Count customers from Germany
-- ==============================================

SELECT COUNT(*) as german_customers
FROM Customers 
WHERE Country = 'Germany';

-- Expected Result: Should return a single number representing German customers