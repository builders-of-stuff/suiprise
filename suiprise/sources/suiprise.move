module suiprise::random;

  use sui::event;
  use sui::random::{Self, Random};

public struct RandomWinnerEvent has copy, drop {
  winner_index: u32
}


entry fun pick_random_winner(entries: u32, random: &Random, ctx: &mut TxContext) {
  let mut generator = random::new_generator(random, ctx);
  let winner_index = random::generate_u32_in_range(&mut generator, 0, entries - 1);

  event::emit(RandomWinnerEvent { winner_index })
}
