SELECT COUNT(*) AS num_east_coast_customers 
FROM Customer 
WHERE state REGEXP "me|vt|nh|ma|ri|ct|ny|nj|pa|de|md|wv|va|nc|sc|ga|al|fl"