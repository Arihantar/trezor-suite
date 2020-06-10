import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Input, Button, Textarea, colors, variables } from '@trezor/components';
import Title from '@wallet-components/Title';
import { WalletLayout } from '@wallet-components';
import * as signVerifyActions from '@wallet-actions/signVerifyActions';
import { WrappedComponentProps } from 'react-intl';
import { Translation } from '@suite-components/Translation';
import messages from '@suite/support/messages';
import { StateProps, DispatchProps } from './Container';
import { useDevice } from '@suite-hooks';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    background: ${colors.WHITE};

    @media screen and (max-width: ${variables.SCREEN_SIZE.MD}) {
        flex-wrap: wrap;
    }
`;

const Row = styled.div`
    padding-bottom: 28px;
`;

const RowButtons = styled(Row)`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const StyledButton = styled(Button)`
    width: 110px;
    margin-left: 10px;

    &:first-child {
        margin-left: 0;
    }
`;

const Column = styled.div`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;

    @media screen and (max-width: ${variables.SCREEN_SIZE.MD}) {
        flex: 1 1 100%;
    }
`;

const Sign = styled(Column)``;

const Verify = styled(Column)`
    padding-left: 20px;

    @media screen and (max-width: ${variables.SCREEN_SIZE.MD}) {
        padding-left: 0px;
    }
`;

interface Props extends WrappedComponentProps {
    selectedAccount: StateProps['selectedAccount'];
    signVerify: StateProps['signVerify'];
    signVerifyActions: DispatchProps['signVerifyActions'];
}

interface FormEvent {
    target: {
        name: string;
        value: string;
    };
}
interface AccountToSign {
    address: string;
    path: string;
    networkType: string;
    coin: string;
    filled: boolean;
}
interface AccountToVerify {
    address: string;
    networkType: string;
    coin: string;
    filled: boolean;
}

type InputNameType = Parameters<typeof signVerifyActions.inputChange>;

const SignVerify = (props: Props) => {
    const {
        intl,
        selectedAccount,
        signVerifyActions,
        signVerify: {
            signMessage,
            signSignature,
            verifyAddress,
            verifyMessage,
            verifySignature,
            errors,
        },
    } = props;
    const { device } = useDevice();

    useEffect(() => {
        return () => {
            signVerifyActions.clearSign(); // clear inputs after coin change
            signVerifyActions.clearVerify();
        };
    }, [signVerifyActions]);

    const getError = (inputName: string) => {
        return props.signVerify!.errors.find(e => e.inputName === inputName);
    };

    const handleInputChange = (event: FormEvent) => {
        props.signVerifyActions.inputChange(
            event.target.name as InputNameType[0],
            event.target.value,
        );
    };

    const fillAccVerify = (): AccountToVerify => {
        const returnObj: AccountToVerify = {
            address: '',
            networkType: '',
            coin: '',
            filled: false,
        };
        if (
            selectedAccount.network?.networkType !== undefined &&
            selectedAccount.account?.symbol !== undefined &&
            verifyAddress.length > 0 &&
            verifyMessage.length > 0 &&
            verifySignature.length > 0
        ) {
            returnObj.networkType = selectedAccount.network?.networkType;
            returnObj.coin = selectedAccount.account?.symbol;
            returnObj.filled = true;
        }
        return returnObj;
    };

    const fillAccSign = (): AccountToSign => {
        const returnObj: AccountToSign = {
            address: '',
            path: '',
            networkType: '',
            coin: '',
            filled: false,
        };

        if (
            selectedAccount.network?.networkType !== undefined &&
            selectedAccount.account?.symbol !== undefined
        ) {
            returnObj.networkType = selectedAccount.network?.networkType;
            returnObj.coin = selectedAccount.account?.symbol;
        } else {
            return returnObj;
        }

        switch (returnObj.networkType) {
            case 'bitcoin': {
                if (
                    typeof selectedAccount.account?.addresses?.change[0]?.address === 'string' &&
                    typeof selectedAccount.account?.addresses?.change[0]?.path === 'string'
                ) {
                    returnObj.address = selectedAccount.account?.addresses?.change[0]?.address;
                    returnObj.path = selectedAccount.account?.addresses?.change[0]?.path;
                    returnObj.filled = true;
                }
                break;
            }
            case 'ethereum': {
                if (typeof selectedAccount.account?.descriptor === 'string') {
                    returnObj.address = selectedAccount.account?.descriptor;
                    returnObj.path = selectedAccount.account?.path;
                    returnObj.filled = true;
                }
                break;
            }
            default:
                break;
        }
        return returnObj;
    };

    const isSignDisabled = () => {
        if (fillAccSign().filled === true && device && device.connected && signMessage.length > 0) {
            return false;
        }
        return true;
    };

    const isVerifyDisabled = () => {
        if (fillAccVerify().filled === true && device && device.connected) {
            return false;
        }
        return true;
    };

    const verifyAddressError = getError('verifyAddress');

    return (
        <WalletLayout title="Sign & Verify" account={selectedAccount}>
            <Wrapper>
                <Sign>
                    <Title>
                        <Translation id="TR_SIGN_MESSAGE" />
                    </Title>
                    <Row>
                        <Input
                            topLabel={intl.formatMessage(messages.TR_ADDRESS)}
                            name="signAddress"
                            value={fillAccSign().address}
                            type="text"
                            readOnly
                        />
                    </Row>
                    <Row>
                        <Textarea
                            topLabel={intl.formatMessage(messages.TR_MESSAGE)}
                            name="signMessage"
                            value={signMessage}
                            onChange={handleInputChange}
                            rows={4}
                            maxRows={4}
                            maxLength={255}
                        />
                    </Row>
                    <Row>
                        <Textarea
                            topLabel={intl.formatMessage(messages.TR_SIGNATURE)}
                            name="signSignature"
                            value={signSignature}
                            rows={4}
                            maxRows={4}
                            maxLength={255}
                            readOnly
                        />
                    </Row>
                    <RowButtons>
                        <StyledButton
                            onClick={props.signVerifyActions.clearSign}
                            variant="secondary"
                        >
                            <Translation id="TR_CLEAR" />
                        </StyledButton>
                        <StyledButton
                            isDisabled={isSignDisabled()}
                            onClick={() =>
                                signVerifyActions.sign(
                                    fillAccSign().path,
                                    signMessage,
                                    false,
                                    fillAccSign().networkType,
                                    fillAccSign().coin,
                                )
                            }
                        >
                            <Translation id="TR_SIGN" />
                        </StyledButton>
                    </RowButtons>
                </Sign>
                <Verify>
                    <Title>
                        <Translation id="TR_VERIFY_MESSAGE" />
                    </Title>
                    <Row>
                        <Input
                            topLabel={intl.formatMessage(messages.TR_ADDRESS)}
                            name="verifyAddress"
                            value={verifyAddress}
                            onChange={handleInputChange}
                            type="text"
                            state={verifyAddressError ? 'error' : undefined}
                            bottomText={verifyAddressError ? verifyAddressError.message : null}
                        />
                    </Row>
                    <Row>
                        <Textarea
                            topLabel={intl.formatMessage(messages.TR_MESSAGE)}
                            name="verifyMessage"
                            value={verifyMessage}
                            onChange={handleInputChange}
                            rows={4}
                            maxRows={4}
                            maxLength={255}
                        />
                    </Row>
                    <Row>
                        <Textarea
                            topLabel={intl.formatMessage(messages.TR_SIGNATURE)}
                            name="verifySignature"
                            value={verifySignature}
                            onChange={handleInputChange}
                            rows={4}
                            maxRows={4}
                            maxLength={255}
                        />
                    </Row>
                    <RowButtons>
                        <StyledButton onClick={signVerifyActions.clearVerify}>
                            <Translation id="TR_CLEAR" />
                        </StyledButton>
                        <StyledButton
                            isDisabled={isVerifyDisabled()}
                            onClick={() => {
                                console.log('errors.length', errors.length);
                                if (errors.length <= 0) {
                                    signVerifyActions.verify(
                                        verifyAddress,
                                        verifyMessage,
                                        verifySignature.trim(),
                                        false,
                                        fillAccVerify().networkType,
                                        fillAccVerify().coin,
                                    );
                                }
                            }}
                        >
                            <Translation id="TR_VERIFY" />
                        </StyledButton>
                    </RowButtons>
                </Verify>
            </Wrapper>
        </WalletLayout>
    );
};

export default SignVerify;
