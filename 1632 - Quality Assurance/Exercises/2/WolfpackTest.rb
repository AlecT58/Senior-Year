require 'minitest/autorun'

require_relative 'wolf'
require_relative 'wolf_pack'

class WolfPackTest < Minitest::Test
    def test_wolfpack_is_a_wolfpack
        pack = WolfPack.new
        assert pack.is_a?(WolfPack)
    end




    # def test_add_new_wolf
    #     pack = wolf_pack.new
    #     pack.add Wolf.new("Chuck", 60)
    # end
end