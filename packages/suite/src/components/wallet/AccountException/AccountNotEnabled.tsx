import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from '@trezor/components';
import * as walletSettingsActions from '@settings-actions/walletSettingsActions';
import { SUITE } from '@suite-actions/constants';
import { AppState, Dispatch } from '@suite-types';
import { Network, Discovery } from '@wallet-types';
import { Translation, Image } from '@suite-components';

import Wrapper from './components/Wrapper';

const mapStateToProps = (state: AppState) => ({
    device: state.suite.device,
    locks: state.suite.locks,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            changeCoinVisibility: walletSettingsActions.changeCoinVisibility,
        },
        dispatch,
    );

type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> & {
        network: Network;
        discovery: Discovery;
    };

/**
 * Handler for invalid router params, coin is not enabled in settings
 * see: @wallet-actions/selectedAccountActions
 */
const AccountNotEnabled = (props: Props) => {
    const { locks, network } = props;
    const locked = locks.includes(SUITE.LOCK_TYPE.DEVICE) || locks.includes(SUITE.LOCK_TYPE.UI);

    return (
        <Wrapper
            title={
                <Translation
                    id="TR_ACCOUNT_EXCEPTION_NOT_ENABLED"
                    values={{ networkName: network.name }}
                />
            }
            image={<Image image="EMPTY_WALLET" />}
        >
            <Button
                variant="primary"
                icon="PLUS"
                isLoading={locked}
                onClick={() => props.changeCoinVisibility(network.symbol, true)}
            >
                <Translation id="TR_ENABLE_NETWORK_BUTTON" values={{ networkName: network.name }} />
            </Button>
        </Wrapper>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountNotEnabled);
