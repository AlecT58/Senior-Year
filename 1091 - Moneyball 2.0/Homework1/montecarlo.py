import random

def run_monte_carlo(times):
    within_twenty = 0

    for n in range(0, times):
        alice = calculate_arrival_time()
        bob = calculate_arrival_time()

        if abs(alice - bob) <= 20:
            within_twenty += 1

    return "{0:.4f}".format(float(within_twenty / times))


def calculate_arrival_time():
    return random.randint(0, 120) + 1

def main():
    print(run_monte_carlo(1000000))

if __name__ == '__main__':
    main()
        