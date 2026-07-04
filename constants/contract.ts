export const CONTRACT_ADDRESS = "0x60Be62dD9B3ED768dbAAc54374b03Ea2F3C52D76" as const;

export const CONTRACT_ABI = [
  {
    type: "function",
    name: "recordDecision",
    inputs: [
      {
        name: "asset",
        type: "string",
        internalType: "string",
      },
      {
        name: "decision",
        type: "string",
        internalType: "string",
      },
      {
        name: "confidence",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "DecisionRecorded",
    inputs: [
      {
        name: "asset",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "decision",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "confidence",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
] as const;
