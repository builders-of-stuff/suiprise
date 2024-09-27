import { SUIPRISE_PACKAGE_ID } from '$lib/shared/shared.constant';
import { walletAdapter } from '@builders-of-stuff/svelte-sui-wallet-adapter';
import { Transaction } from '@mysten/sui/transactions';

export const pickRandomWinner = async (numberOfEntries: number) => {
  if (!walletAdapter?.currentAccount?.address) {
    return;
  }

  const tx = new Transaction();

  tx.moveCall({
    target: `${SUIPRISE_PACKAGE_ID}::random::pick_random_winner`,
    arguments: [tx.pure.u32(numberOfEntries), tx.object('0x8')]
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

    const executedTx = await walletAdapter.suiClient.executeTransactionBlock({
      transactionBlock: bytes,
      signature,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
        showInput: true,
        showRawInput: true
      }
    });

    const winnerIndex = executedTx?.events?.find?.(
      (event) => event.type === `${SUIPRISE_PACKAGE_ID}::random::RandomWinnerEvent`
    )?.parsedJson?.winner_index;

    return { winnerIndex };
  } catch (error) {
    console.error(error);
  }
};
