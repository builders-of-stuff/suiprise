module suiprise::random;

use sui::random::{Self, Random};

entry fun pick_random_winner(entries: u32, random: &Random, ctx: &mut TxContext): u32 {
  let mut generator = random::new_generator(random, ctx);

  random::generate_u32_in_range(&mut generator, 1, entries)
}
