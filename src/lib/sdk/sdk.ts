import { devnetWalletAdapter } from '@builders-of-stuff/svelte-sui-wallet-adapter';
import { Transaction } from '@mysten/sui/transactions';

const walletAdapter = devnetWalletAdapter;

export const pickRandomWinner = async (numberOfEntries: number) => {
  if (!walletAdapter?.currentAccount?.address) {
    return;
  }

  const tx = new Transaction();

  // starts at 1
  const [winnerIndex] = tx.moveCall({
    target: `<package>::random::pick_random_winner`,
    arguments: [tx.pure.u32(numberOfEntries), tx.object('0x8')]
  });

  console.log('winnerIndex: ', winnerIndex);

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

    return { executedTx };
  } catch (error) {
    console.error(error);
  }
};
