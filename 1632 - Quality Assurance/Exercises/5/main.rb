require_relative 'graph.rb'
require_relative 'node.rb'

g = Graph.new

loop do
  g.print
  begin
    print 'Enter new node id (or q to quit)> '
    id = gets.chomp
    break if id == 'q'
    id = id.to_i
    print 'Enter neighbors (separated by commas) > '
    neighbors = gets.chomp.split(',').map(&:key)
    puts "main: n = #{neighbors}"
    n = Node.new id, neighbors
    g.add_node n
  rescue StandardError
    puts "I don't understand.  Try again."
  end
end

if g.is_pseudograph?
  puts 'Congratulations, you created a pseudograph'
else
  puts 'You did not create a pseudograph'
end
