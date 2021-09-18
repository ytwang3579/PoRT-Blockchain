# Wallet

This wallet is the implementation of Hierachical Deterministic Wallet(HDWallet). We use master key as the root of the wallet, so that the users can create their own wallet based on the given master key. By the wat, users can also get default wallet whose key pairs is automatically generated.

## Struture of Wallet
    
    privateKey(string) - Master private key of the wallet
    publicKey (string) - Master public key of the wallet
    chainCode (string) - Master chaincode, random generated 32bytes string
    depth     (int)    - Depth of the derive path (i.e m/123/12/1, depth = 3)
    index     (int)    - Index of the lowest level from the derive path

## Reminder

1. Master key should be 32 bytes string 
2. Chaincode is now random generated 32 bytes string

## Testing File Usage

### Create Wallet
Create wallet by default
```javascript
node src/wallet_test.js create_wallet
```

Create wallet with private key
```javascript
node src/wallet_test.js create_wallet [private key]
```

Create wallet with both private key and public key
```javascript
node src/wallet_test.js create_wallet [private key] [public key]
```

Create wallet by path
```javascript
node src/wallet_test.js derive_wallet [derive path]
```

### Create Transaction
Create trasaction with arguments
```javascript
node src/wallet_test.js create_tx [transaction id] [to] [value]
```

## Futrue work
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
