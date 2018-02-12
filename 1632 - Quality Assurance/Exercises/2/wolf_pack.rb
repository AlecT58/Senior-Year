class WolfPack

    # Create a new wolf pack, with no wolves
    def initialize
      @wolves = []
    end
  
    # Make all wolves in pack howl by calling their
    # .howl method.  If there are no wolves in the pack,
    # do nothing.
    def all_howl
      # TODO
      # each, call howl
      # @wolves.each |x| do
      #   x.howl
      # end
    end
  
    # Make one random wolf in pack bark by calling their
    # .bark method.  If there are no wolves, do nothing.
    def one_bark
      # TODO
      # sample, call bark
      # @wolves.sample |x| do
      #   x.bark
      # end
    end
  
    # Create a new wolf and add it to the pack
    def add_wolf wolf
      # @wolves.push wolf
    end
  
    # Return the wolf with the largest size in @wolves
    def biggest_wolf
      # TODO
    end
  end