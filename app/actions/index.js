import {
  SAVE_ADDRESS_SUCCESS,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE,
  FETCH_BALANCE_SUCCESS,
} from '../constants/addressActions';
import Storage from '../api/storage';
import Ethereum from '../api/ethereum';
import { getAddressList } from '../reducers/addresses';

export function fetchBalanceSuccess(payload) {
  return {
    type: FETCH_BALANCE_SUCCESS,
    payload,
  };
}

export function fetchBalances(addresses) {
  return async dispatch => {
    console.log('fetching balances');
    addresses.forEach(async address => {
      if (address.currencyId === 'eth') {
        const ethPayload = await Ethereum.fetchBalance(address);
        console.log(`address with balance is: ${JSON.stringify(ethPayload)}`);
        dispatch(fetchBalanceSuccess(ethPayload));
      }
    });
  };
}

export function saveAddressSuccess(addresses) {
  return {
    type: SAVE_ADDRESS_SUCCESS,
    payload: addresses,
  };
}

export function saveAddress(address) {
  return async dispatch => {
    console.log('saveAddress action');
    const savedAddresses = await Storage.saveAddress(address);
    console.log(`saved addresses are: ${JSON.stringify(savedAddresses)}`);
    dispatch(saveAddressSuccess(savedAddresses));
    dispatch(
      fetchBalances(
        Object.values(savedAddresses.byId).filter(
          addr => addr.currencyId === 'eth',
        ),
      ),
    );
  };
}

export function fetchAddressesSuccess(addresses) {
  return {
    type: FETCH_ADDRESSES_SUCCESS,
    payload: addresses,
  };
}

export function fetchAddressesFailure(payload) {
  return {
    type: FETCH_ADDRESSES_FAILURE,
    payload,
  };
}
