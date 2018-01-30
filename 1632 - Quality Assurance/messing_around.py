import math
import time

def is_prime(n):
    if n % 2 == 0 and n > 2: 
        return False
    return all(n % i for i in range(3, int(math.sqrt(n)) + 1, 2))

upper = int(input("Enter an upper bound value > "))
print ("Calculating prime numbers...")
start = time.time()

values = [x for x in range(2, upper+1) if is_prime(x)]

for val in values:
    print ("{} is prime".format(val))

print("Took {} s to test {} values".format(time.time() - start, upper))
    