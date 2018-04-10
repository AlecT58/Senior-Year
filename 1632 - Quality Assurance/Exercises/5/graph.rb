require_relative './node.rb'

class Graph
  def initialize
    @nodes = {}
  end

  def num_nodes
    @nodes.keys.count
  end

  def node?(id)
    @nodes.keys.include? id
  end
  
  def add_node(node)
    @nodes[node.id] = node
    node.id
  end

  def pseudograph?
    @nodes.values.any?(&:links_to_self?)
  end

  def print
    if @nodes.keys.count.zero?
      puts 'Empty graph!'
    else
      @nodes.each do |_k, v|
        puts v
      end
    end
  end
end
