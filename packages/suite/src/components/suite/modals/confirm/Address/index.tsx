import React, { createRef } from 'react';
import styled from 'styled-components';
import * as notificationActions from '@suite-actions/notificationActions';
import { Button, Modal, colors } from '@trezor/components';
import { copyToClipboard } from '@suite-utils/dom';
import { TrezorDevice } from '@suite-types';
import { Translation, QrCode } from '@suite-components';

import CheckOnTrezor from './components/CheckOnTrezor';
import DeviceDisconnected from './components/DeviceDisconnected';
import { useActions } from '@suite-hooks';

const Address = styled.div`
    width: 100%;
    background: ${colors.BLACK96};
    border: 1px solid ${colors.BLACK80};
    border-radius: 6px;
    word-break: break-all;
    font-size: 20px;
    padding: 20px;
    margin-bottom: 40px;
`;

const Row = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

type Props = {
    device: TrezorDevice;
    address: string;
    addressPath?: string;
    networkType: string;
    symbol: string;
    cancelable?: boolean;
    onCancel?: () => void;
};

const ConfirmAddress = ({
    device,
    address,
    addressPath,
    networkType,
    symbol,
    cancelable,
    onCancel,
}: Props) => {
    // TODO: no-backup, backup failed
    // const needsBackup = device.features && device.features.needs_backup;

    const { addNotification } = useActions({ addNotification: notificationActions.addToast });
    const htmlElement = createRef<HTMLDivElement>();

    const copyAddress = () => {
        const result = copyToClipboard(address, htmlElement.current);
        if (typeof result !== 'string') {
            addNotification({ type: 'copy-to-clipboard' });
        }
    };

    return (
        <Modal
            heading={
                <Translation
                    id="TR_ADDRESS_MODAL_TITLE"
                    values={{ networkName: symbol.toUpperCase() }}
                />
            }
            description={
                networkType === 'bitcoin' ? (
                    <Translation id="TR_ADDRESS_MODAL_BTC_DESCRIPTION" />
                ) : undefined
            }
            cancelable={cancelable}
            onCancel={onCancel}
            size="small"
            bottomBar={
                <Row ref={htmlElement}>
                    <Button variant="primary" onClick={copyAddress}>
                        <Translation id="TR_ADDRESS_MODAL_CLIPBOARD" />
                    </Button>
                </Row>
            }
        >
            <QrCode value={address} addressPath={addressPath} />
            <Address data-test="@address-modal/address-field">{address}</Address>
            {device.connected && <CheckOnTrezor device={device} />}
            {!device.connected && <DeviceDisconnected label={device.label} />}
        </Modal>
    );
};

export default ConfirmAddress;
