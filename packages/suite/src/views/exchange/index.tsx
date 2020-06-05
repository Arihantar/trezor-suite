import React from 'react';
import { Select, H2, P } from '@trezor/components';
import { useExchange } from '@exchange-hooks';
import { WalletLayout } from '@wallet-components';
import { ExchangeLayout } from '@exchange-components';

// Exchange top-level component used in two contexts: `wallet` and standalone `exchange` app
export default () => {
    const { app, selectedAccount } = useExchange();

    // wrap by WalletLayout using wallet menu
    if (app === 'wallet') {
        // account loading or exception
        if (selectedAccount.status !== 'loaded') {
            return <WalletLayout title="Exchange" account={selectedAccount} />;
        }

        const { account } = selectedAccount;

        return (
            <WalletLayout title="Exchange" account={selectedAccount}>
                <H2>Exchange in account context</H2>
                <P>Account descriptor: {account.descriptor}</P>
                <P>Balance: {account.balance}</P>
                {/* <P>
                    Fresh address:{' '}
                    {account.networkType === 'bitcoin'
                        ? `${account.addresses?.unused[0].path} : ${account.addresses?.unused[0].address}`
                        : `${account.path} : ${account.descriptor}`}
                </P> */}
                <P>Select to:</P>
                <Select />
            </WalletLayout>
        );
    }

    // wrap by ExchangeLayout using exchange menu
    return (
        <ExchangeLayout title="Exchange">
            <H2>Exchange in standalone context</H2>
            <P>Select from:</P>
            <Select />
            <P>Select to:</P>
            <Select />
        </ExchangeLayout>
    );
};
