SELECT CONCAT(first_name, " ", last_name) AS full_name 
FROM Customer 
WHERE address_1 LIKE "%street"