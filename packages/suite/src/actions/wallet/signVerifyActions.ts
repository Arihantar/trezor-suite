import TrezorConnect from 'trezor-connect';
import { validateAddress as validateEthAddress } from '@wallet-utils/ethUtils';
import { isAddressValid as validateBtcAddress } from '@wallet-utils/validation';
import * as notificationActions from '@suite-actions/notificationActions';
import { SIGN_VERIFY } from './constants';
import { Dispatch } from '@suite-types';
import { Account as Account$ } from '@wallet-reducers/accountsReducer';

export type inputNameType =
    | 'signAddress'
    | 'signMessage'
    | 'signSignature'
    | 'verifyAddress'
    | 'verifyMessage'
    | 'verifySignature';

export type SignVerifyActions =
    | { type: typeof SIGN_VERIFY.SIGN_SUCCESS; signSignature: string }
    | { type: typeof SIGN_VERIFY.CLEAR_SIGN }
    | { type: typeof SIGN_VERIFY.CLEAR_VERIFY }
    | { type: typeof SIGN_VERIFY.INPUT_CHANGE; inputName: inputNameType; value: string }
    | { type: typeof SIGN_VERIFY.TOUCH; inputName: inputNameType }
    | { type: typeof SIGN_VERIFY.ERROR; inputName: inputNameType; message?: string };

export const sign = (
    path: string,
    message: string,
    hex = false,
    networkType: string,
    coin: string,
) => async (dispatch: Dispatch) => {
    let fn;
    const params = {
        path,
        coin,
        message,
        hex,
    };
    switch (networkType) {
        case 'bitcoin':
            fn = TrezorConnect.signMessage;
            break;
        case 'ethereum':
            fn = TrezorConnect.ethereumSignMessage;
            break;
        default:
            fn = () => ({
                success: false,
                payload: {
                    error: `Unsupported network: ${networkType}`,
                    code: undefined,
                    signature: '',
                },
            });
            break;
    }
    const response = await fn(params);

    if (response.success === true) {
        dispatch({
            type: SIGN_VERIFY.SIGN_SUCCESS,
            signSignature: response.payload.signature,
        });
    } else {
        dispatch(
            notificationActions.addToast({
                type: 'sign-message-error',
                error: response.payload.error,
            }),
        );
    }
};

export const verify = (
    address: string,
    message: string,
    signature: string,
    hex = false,
    networkType: string,
    coin: string,
) => async (dispatch: Dispatch) => {
    let fn;
    const params = {
        address,
        message,
        signature,
        coin,
        hex,
    };
    let error = null;

    switch (networkType) {
        case 'bitcoin':
            error = validateBtcAddress(address, coin as Account$['symbol']) ? null : 'Error';
            fn = TrezorConnect.verifyMessage;
            break;
        case 'ethereum':
            error = validateEthAddress(address);
            fn = TrezorConnect.ethereumVerifyMessage;
            break;
        default:
            fn = () => ({
                success: false,
                payload: {
                    error: `Unsupported network: ${networkType}`,
                    code: undefined,
                    signature: '',
                },
            });
            break;
    }

    if (error) {
        dispatch({
            type: SIGN_VERIFY.ERROR,
            inputName: 'verifyAddress',
            message: error,
        });
        return;
    }

    const response = await fn(params);

    if (response.success === true) {
        dispatch(
            notificationActions.addToast({
                type: 'verify-message-success',
            }),
        );
    } else {
        dispatch(
            notificationActions.addToast({
                type: 'verify-message-error',
                error: response.payload.error,
            }),
        );
    }
};

export const inputChange = (inputName: inputNameType, value: string) => (dispatch: Dispatch) => {
    dispatch({
        type: SIGN_VERIFY.INPUT_CHANGE,
        inputName,
        value,
    });
    dispatch({
        type: SIGN_VERIFY.TOUCH,
        inputName,
    });

    // TODO: RETURN HERE after consultation
    // if (inputName === 'verifyAddress') {
    //     const error = validateEthAddress(value);
    //     if (error) {
    //         dispatch({
    //             type: SIGN_VERIFY.ERROR,
    //             inputName,
    //             message: error,
    //         });
    //     }
    // }
};

export const clearSign = (): SignVerifyActions => ({
    type: SIGN_VERIFY.CLEAR_SIGN,
});

export const clearVerify = (): SignVerifyActions => ({
    type: SIGN_VERIFY.CLEAR_VERIFY,
});
