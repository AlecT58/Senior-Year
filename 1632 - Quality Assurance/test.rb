=begin
    Varibale types:
        $ is a global
        @ is instance
        @@ is class
        _ is local
=end

# Conditionals
$test = true
print "Testing conditionals\n" if $test

if 3 > 2
    puts "3 is greater than 2"
else
    puts "Bizare"
end

unless 3 < 2
    puts "3 is still less than 2"
else 
    puts "Bizare"
end

value = 3

case value
when 0 .. 2
    puts "Value is between 0 and 2"
when 3 .. 5
    puts "Value is between 3 and 5"
else
    puts "Bizare"
end

$test = false
print "Testing conditionals over\n\n" unless $test

# Loops
puts "Testing loops"
j = 5

i = 0
while i < j do
    puts "While loop index: #{i}"
    i += 1
end

print "\n"
i = 0
begin
    puts "Do-while loop index: #{i}"
    i += 1
end while i < j

print "\n"
i = 0
until i > j do
    puts "Until loop index: #{i}"
    i += 1
end

print "\n"
for k in 0..5 do
    puts "For .. loop index: #{k}"
end

print "\n"
(0..5).each do |k|
    puts "Each loop index: #{k}"

