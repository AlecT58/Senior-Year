require 'prime'

print "Enter an upper bound value > "
upper = gets.chomp().to_i

puts "Calculating prime numbers..."
start = Time.now

(2..upper).map { |x| x}.each {|x| if Prime.prime?(x) then puts "#{x} is prime" end}

puts "Took #{Time.now - start} s to test #{upper} values"