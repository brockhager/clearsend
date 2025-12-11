export type Recipient = {
  id: string;
  name: string;
  dfsp: string;
};

const DFSPs = ['DFSP-A', 'DFSP-B', 'DFSP-C'];

export const discoverRecipient = async (recipientId: string): Promise<Recipient> => {
  // Mock latency
  await new Promise((r) => setTimeout(r, 600));

  // Mock discovery logic: if recipientId is numeric, generate a name
  const dfsp = DFSPs[Number(recipientId.charCodeAt(0)) % DFSPs.length];
  return {
    id: recipientId,
    name: `User ${recipientId.slice(-4)}`,
    dfsp
  };
};

export type Quote = { amount: number; fee: number; totalDebit: number };

export const createQuote = async (amount: number): Promise<Quote> => {
  await new Promise((r) => setTimeout(r, 600));
  const fee = Math.max(0.5, +(amount * 0.01).toFixed(2)); // 1% fee or min $0.5
  const totalDebit = +(amount + fee).toFixed(2);
  return { amount, fee, totalDebit };
};

export const executeTransfer = async (fromAccountId: string, toRecipientId: string, amount: number, quote: Quote) => {
  await new Promise((r) => setTimeout(r, 1000));
  // Return success
  return {
    success: true,
    transferId: `${Date.now()}-${Math.floor(Math.random()*1000)}`,
    amount,
    fee: quote.fee
  };
};
