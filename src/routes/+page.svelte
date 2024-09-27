<script>
  import { read, utils } from 'xlsx';
  import {
    ConnectButton,
    devnetWalletAdapter as walletAdapter
  } from '@builders-of-stuff/svelte-sui-wallet-adapter';
  import confetti from 'canvas-confetti';
  import { pickRandomWinner } from '$lib/sdk/sdk';

  let fileInput = $state();
  let parsedData = [];
  let manualInput = $state('');
  let winner = $state('');

  const entries = $derived(manualInput?.split(',')?.filter?.(Boolean));
  const numberOfEntries = $derived(entries?.length);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e?.target?.result);
      const workbook = read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      parsedData = utils.sheet_to_json(worksheet, { header: 1 });
      manualInput = parsedData.flat().join(', ');
    };

    reader.readAsArrayBuffer(file);
  }

  async function pickWinner() {
    await pickRandomWinner(numberOfEntries)
      .then((response) => {
        console.log('response: ', response);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        return response;
      })
      .catch((error) => {
        console.error('error: ', error);
      });
  }
</script>

<div class="container relative mx-auto min-h-screen max-w-3xl p-4">
  <h1 class="mb-4 text-2xl font-bold">Suiprise</h1>

  <p class="mb-6 text-gray-600">
    Select a random winner from a list of comma-separated values, either uploaded from
    an excel file or manually entered. On-chain randomness is provided by Sui (wallet
    connection and gas fees are required).
  </p>

  <div class="mb-4">
    <label for="fileInput" class="mb-2 block text-sm font-medium text-gray-700"
      >Upload Excel File</label
    >
    <input
      id="fileInput"
      type="file"
      accept=".xlsx, .xls"
      onchange={handleFileUpload}
      bind:this={fileInput}
      class="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
    />
  </div>

  <div class="mb-4">
    <label for="manualInput" class="mb-2 block text-sm font-medium text-gray-700"
      >Enter values (comma-separated)</label
    >
    <textarea
      id="manualInput"
      bind:value={manualInput}
      rows="10"
      class="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      placeholder="e.g. Alice, Bob, Charlie"
    ></textarea>

    {#if numberOfEntries > 0}
      <p class="mt-2 text-sm text-gray-500">{numberOfEntries} entries</p>
    {/if}
  </div>

  <ConnectButton {walletAdapter} />

  <button
    onclick={pickWinner}
    class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:text-gray-500"
    disabled={!walletAdapter.isConnected}
  >
    Pick Winner
  </button>

  {#if winner}
    <div class="mt-4 rounded-md bg-green-100 p-4">
      <h2 class="text-lg font-semibold text-green-800">Winner:</h2>
      <p class="text-green-700">{winner}</p>
    </div>
  {/if}

  <a
    href="https://github.com/builders-of-stuff/suiprise"
    target="_blank"
    rel="noopener noreferrer"
    class="absolute bottom-4 right-4"
    aria-label="GitHub repository"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-gray-600 hover:text-gray-800"
    >
      <path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
      ></path>
    </svg>
  </a>
</div>
