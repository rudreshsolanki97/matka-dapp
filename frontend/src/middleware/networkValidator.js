import * as types from "../actions/types";
import * as actions from "../actions";
import { IsHex, RUNNING_CHAIN } from "../helpers/constant";

export const NetworkValidation = (store) => (next) => (action) => {
  if (
    [types.WALLET_CONNECTED, types.WALLET_CHAIN_CHANGED].includes(action.type)
  ) {
    let { chain_id } = action.payload;
    if (String(chain_id).startsWith("0x") && IsHex(chain_id))
      chain_id = parseInt(chain_id, 16);
    if (chain_id === RUNNING_CHAIN) store.dispatch(actions.NetworkValid());
    else store.dispatch(actions.NetworkInValid());
  }
  next(action);
};
