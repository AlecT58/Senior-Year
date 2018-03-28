SELECT CONCAT(first_name, " ", last_name) AS full_name, email, facebook_url
FROM Salesperson
WHERE state='pa'
ORDER BY full_name