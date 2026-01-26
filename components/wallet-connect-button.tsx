'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletConnectButton() {
  return (
    <WalletMultiButton 
      className="!bg-gradient-to-r !from-purple-600 !to-blue-600 !rounded-lg !px-4 !py-2 !text-sm !font-medium hover:!from-purple-700 hover:!to-blue-700 !transition-all"
    />
  );
}
