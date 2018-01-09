import sys

P_SPAM = .394
P_NOT_SPAM = 1 - P_SPAM
IS_SPAM = 1
K_FOLDS = 5

def main():
    averages = generate_average_list()
    parsed_data = parse_file(sys.argv[1])
    avg_errors = []

    print('Iteration  + in Training  - in Training  + in Dev  - in Dev')
    for stats in range(0, K_FOLDS):
        generate_sample_statistics(parsed_data, stats)

    for training in range(0, K_FOLDS):
        trained_features = train_features(parsed_data, averages, 4-training)

    print()
    for fold in range(0, K_FOLDS):
       avg_errors.append(test_fold(parsed_data, trained_features, averages, fold))

    calculate_average_errors(avg_errors)
    #generate_report(trained_features)
 
# Reads the documentation of the spambase and generates a list of the averages
def generate_average_list():
    list_of_averages = []

    with open('spambase_documentation.txt', mode='r') as stats:
        for line in stats:
            data_split = []
            data_split.append(line.split())

            for data in data_split:
                list_of_averages.append(float(data[3]))

    return list_of_averages

# Parse the spambase and return a list of  5 lists (5 folds)
def parse_file(fname):
    list_of_data = [[], [], [], [], []]

    with open(fname, mode='r') as spambase_data:
        current = 1

        for line in spambase_data:
            list_of_data[current % K_FOLDS].append([float(x.strip()) if x != '0' else 0.014 for x in line.split(',')])
            current +=1

    return list_of_data

# Helper method to run Bayes' Theorm
def bayes_theorm(A, conditional, not_conditional):
    numerator = conditional * A
    denominator = numerator + (not_conditional * (1 - A))
    return numerator / denominator

# Runs through all groups expect for the current iteration's fold # to return the training groups
def train_features(parsed_features, averages, fold_number):
    feature_counter = 0
    total_tested = 0
    spam_count = 0
    non_spam_count = 0
    less_than_count = 0
    greater_than_count = 0

    trained_features = [[0 for x in range(4)] for y in range(57)] 
    spam_less_than = [0] * 57
    spam_greater_than = [0] * 57
    not_spam_less_than = [0] * 57
    not_spam_greater_than = [0] * 57

    for index in range(0, K_FOLDS):
        if index != fold_number:
            for fold in parsed_features[index]:
                for feature in fold[:-1]:
                    total_tested += 1

                    if fold[-1] == IS_SPAM and feature <= averages[feature_counter]:
                        spam_count += 1
                        less_than_count += 1
                        spam_less_than[feature_counter] += 1
                    elif fold[-1] == IS_SPAM and feature > averages[feature_counter]:
                        spam_count += 1
                        greater_than_count += 1
                        spam_greater_than[feature_counter] += 1
                    elif feature <= averages[feature_counter]:
                        non_spam_count += 1
                        less_than_count += 1
                        not_spam_less_than[feature_counter] += 1
                    else:
                        non_spam_count += 1
                        greater_than_count += 1
                        not_spam_greater_than[feature_counter] += 1

                    feature_counter += 1
                feature_counter = 0

    for index in range(0, 57):
        trained_features[index][0] = bayes_theorm(less_than_count / total_tested, spam_less_than[index] / spam_count, spam_greater_than[index] / spam_count)
        trained_features[index][1] = bayes_theorm(greater_than_count / total_tested, spam_greater_than[index] / spam_count, spam_less_than[index] / spam_count)
        trained_features[index][2] = bayes_theorm(less_than_count / total_tested, not_spam_less_than[index] / spam_count, not_spam_greater_than[index] / spam_count)
        trained_features[index][3] = bayes_theorm(greater_than_count / total_tested, not_spam_greater_than[index] / spam_count, not_spam_less_than[index] / spam_count)
    
    return trained_features

# Compares the training group with the current fold to return the errors of the current fold
def test_fold(parsed_features, trained_features, averages, fold_number):
    feature_counter = 0
    total_tested = 0
    spam_count = 0
    non_spam_count = 0
    less_than_count = 0
    greater_than_count = 0

    tested_features = [[0 for x in range(4)] for y in range(57)] 
    spam_less_than = [0] * 57
    spam_greater_than = [0] * 57
    not_spam_less_than = [0] * 57
    not_spam_greater_than = [0] * 57

    false_positive_count = 0
    false_negative_count = 0
    ok_count = 0

    for fold in parsed_features[fold_number]:
        for feature in fold[:-1]:
            total_tested += 1

            if fold[-1] == IS_SPAM and feature <= averages[feature_counter]:
                spam_count += 1
                less_than_count += 1
                spam_less_than[feature_counter] += 1
            elif fold[-1] == IS_SPAM and feature > averages[feature_counter]:
                spam_count += 1
                greater_than_count += 1
                spam_greater_than[feature_counter] += 1
            elif feature <= averages[feature_counter]:
                non_spam_count += 1
                less_than_count += 1
                not_spam_less_than[feature_counter] += 1
            else:
                non_spam_count += 1
                greater_than_count += 1
                not_spam_greater_than[feature_counter] += 1

            feature_counter += 1
        feature_counter = 0

    for index in range(0, 57):
        tested_features[index][0] = bayes_theorm(less_than_count / total_tested, spam_less_than[index] / spam_count, spam_greater_than[index] / spam_count)
        tested_features[index][1] = bayes_theorm(greater_than_count / total_tested, spam_greater_than[index] / spam_count, spam_less_than[index] / spam_count)
        tested_features[index][2] = bayes_theorm(less_than_count / total_tested, not_spam_less_than[index] / spam_count, not_spam_greater_than[index] / spam_count)
        tested_features[index][3] = bayes_theorm(greater_than_count / total_tested, not_spam_greater_than[index] / spam_count, not_spam_less_than[index] / spam_count)

    total_tested = 0
    for fold in parsed_features[fold_number]:
        for index in range(0, 57):
            total_tested += 1
            if tested_features[index][3] > trained_features[index][3] and tested_features[index][1] > trained_features[index][1]:
                false_positive_count += 1
            elif tested_features[index][0] > trained_features[index][0] and tested_features[index][2] > trained_features[index][2]:
                false_negative_count += 1
            else:
                ok_count += 1

    print('Fold #{} - False positive: {:.1%}, False negative: {:.1%}, Overall: {:.1%}'.format(fold_number + 1, false_positive_count/total_tested, false_negative_count/total_tested, 1-(ok_count/total_tested)))

    return [false_positive_count/total_tested, false_negative_count/total_tested, 1-(ok_count/total_tested)]

# Calculates and displays the average error stats
def calculate_average_errors(avg_errors):
    num_errors = len(avg_errors)
    false_positive = 0
    false_negative = 0
    overall = 0

    for error in avg_errors:
        false_positive += error[0]
        false_negative += error[1]
        overall += error[2]

    print('Average - False positive: {:.1%}, False negative: {:.1%}, Overall: {:.1%}\n'.format(false_positive/num_errors, false_negative/num_errors, overall/num_errors))

# Generates the required report data, not used in actual implementation
def generate_report(trained_features):
    for feature in range(0, 57):
        print('{}'.format(trained_features[feature][0]))
        print('{}'.format(trained_features[feature][1]))
        print('{}'.format(trained_features[feature][2]))
        print('{}'.format(trained_features[feature][3]))

# Prints the sample stats table at the start of the program
def generate_sample_statistics(parsed_data, fold_number):
    positive_count_train = 0
    negative_count_train = 0
    positive_count_dev = 0
    negative_count_dev = 0

    for index in range(0, 5):
        for fold in parsed_data[index]:
            if fold[-1] == 1 and index == fold_number:
                positive_count_dev += 1
            elif fold[-1] == 0 and index == fold_number:
                negative_count_dev += 1
            elif fold[-1] == 0 and index != fold_number:
                negative_count_train += 1
            else:
                positive_count_train += 1

    print('{}\t   {}\t\t  {}\t\t {}\t   {}'.format(fold_number+1, positive_count_train, negative_count_train, positive_count_dev, negative_count_dev))

if __name__ == "__main__":
    main()