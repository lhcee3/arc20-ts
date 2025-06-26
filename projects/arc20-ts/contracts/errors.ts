/* eslint-disable prettier/prettier */
export const ERROR_MESSAGES = {
  // Global and Local Bytes/UInts
  WRONG_GLOBAL_BYTES: 'Wrong Global Bytes allocation',
  WRONG_GLOBAL_UINTS: 'Wrong Global UInts allocation',
  WRONG_LOCAL_BYTES: 'Wrong Local Bytes allocation',
  WRONG_LOCAL_UINTS: 'Wrong Local UInts allocation',
  // On Complete
  WRONG_ON_COMPLETE: 'Wrong On Complete Action',

  // Authorization Errors
  UNAUTHORIZED: 'Unauthorized',
  UNAUTHORIZED_MANAGER: 'Unauthorized Manager',
  UNAUTHORIZED_RESERVE: 'Unauthorized Reserve',
  UNAUTHORIZED_FREEZE: 'Unauthorized Freeze',
  UNAUTHORIZED_CLAWBACK: 'Unauthorized Clawback',

  // Asset Control Errors
  MISSING_CTRL_ASA: 'Missing Controlled ASA',
  INVALID_CTRL_ASA: 'Invalid Controlled ASA ID',
  EXISTING_CTRL_ASA: 'Controlled ASA already created',

  // Disabled Addresses
  DISABLED_RESERVE: 'Reserve Address has been deleted',
  DISABLED_FREEZE: 'Freeze Address has been deleted',
  DISABLED_CLAWBACK: 'Clawback Address has been deleted',

  // Frozen Errors
  GLOBAL_FROZEN: 'Smart ASA is global frozen',
  SENDER_FROZEN: 'Sender account is frozen',
  RECEIVER_FROZEN: 'Receiver account is frozen',
  CLOSE_TO_FROZEN: 'Close to account is frozen',

  // Opt-In Errors
  OPT_IN_WRONG_TYPE: 'Wrong ASA Opt In txn type',
  OPT_IN_WRONG_ASA: 'Wrong ASA Opt In ID',
  OPT_IN_WRONG_SENDER: 'Wrong ASA Opt In Sender',
  OPT_IN_WRONG_RECEIVER: 'Wrong ASA Opt In Receiver',
  OPT_IN_WRONG_AMOUNT: 'Wrong ASA Opt In Amount',
  OPT_IN_WRONG_CLOSE_TO: 'Forbidden Close Out on Opt In',
  OPT_IN_MISSING: 'Missing OptIn',

  // Close-Out Errors
  CLOSE_OUT_WRONG_TYPE: 'Wrong ASA Close Out txn type',
  CLOSE_OUT_WRONG_ASA: 'Wrong ASA Close Out ID',
  CLOSE_OUT_WRONG_SENDER: 'Wrong ASA Close Out Sender',
  CLOSE_OUT_WRONG_AMOUNT: 'Wrong ASA Close Out Amount',
  CLOSE_OUT_WRONG_CLOSE_TO: 'Wrong Close Out on Close Out',
  INVALID_CLOSE_OUT_GROUP_SIZE: 'Invalid Close Out group size',

  // General Errors
  INVALID_TOTAL: 'Invalid Total, must be >= circulating supply',

  // Minting and Burning Errors
  SELF_MINT: 'Forbidden self minting',
  OVER_MINT: 'Forbidden over minting',
  CLAWBACK_BURN: 'Forbidden clawback burning',

  // Domain-Specific Errors
  INVALID_ASSET_ID: 'Provided asset ID is invalid or does not exist',
  ASSET_NOT_FOUND: 'Asset not found on the blockchain',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this operation',
  INVALID_ADDRESS: 'Provided address is invalid',
  TRANSACTION_FAILED: 'Transaction failed to process',
  NETWORK_ERROR: 'Network error occurred while communicating with Algorand node',
  INVALID_DECIMALS: 'Decimals value is out of allowed range',
  INVALID_UNIT_NAME: 'Unit name is invalid or too long',
  INVALID_METADATA_HASH: 'Metadata hash is invalid or improperly formatted',
  MANAGER_NOT_SET: 'Manager address is not set',
  RESERVE_NOT_SET: 'Reserve address is not set',
  FREEZE_NOT_SET: 'Freeze address is not set',
  CLAWBACK_NOT_SET: 'Clawback address is not set',
  ASSET_ALREADY_OPTED_IN: 'Account has already opted in to this asset',
  ASSET_NOT_OPTED_IN: 'Account has not opted in to this asset',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
};
