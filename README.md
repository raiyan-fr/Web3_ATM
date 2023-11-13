## Web3_ATM
A web page representing a simple decentralized application (DApp) that interacts with an Ethereum smart contract.

# Main Components

1. **Import Statements:**
   - The component imports necessary modules from the `react` and `ethers` libraries.
   - It also imports the ABI (Application Binary Interface) of an Ethereum smart contract from a file named `Assessment.sol/Assessment.json`.

2. **Component State:**
   - The component uses the `useState` hook to manage various states, including `ethWallet` (representing the MetaMask wallet), `account` (the connected Ethereum account), `atm` (an instance of the Ethereum smart contract), `balance` (the user's balance), and flags for deposit and withdrawal success.

3. **Contract Address and ABI:**
   - The Ethereum smart contract's address and ABI are hardcoded in the component. The ABI is necessary to interact with the contract's functions.

4. **Functions:**
   - `getWallet`: Checks if MetaMask is installed and retrieves the user's accounts if available.
   - `handleAccount`: Handles the user's Ethereum accounts.
   - `connectAccount`: Connects the user's MetaMask account and initializes the smart contract.
   - `getATMContract`: Creates an instance of the smart contract using ethers.js.
   - `getBalance`: Retrieves the user's balance from the smart contract.
   - `deposit` and `withdraw`: Interact with the smart contract to deposit and withdraw funds.
   - `depositHistory` and `withdrawHistory`: Interact with the smart contract to give deposit and withdraw history.
   - `initUser`: Renders different UI elements based on the user's MetaMask status, account connection, and balance.

5. **Lifecycle and Rendering:**
   - The `useEffect` hook is used to call `getWallet` when the component mounts.
   - The main render function returns JSX representing the web page's structure and UI elements. It includes buttons to connect the MetaMask wallet, display user information, and perform deposit/withdraw actions.
   - Styles for the UI elements are defined using the `styled-jsx` syntax.

6. **Styling:**
   - The component defines styles using the `styled-jsx` syntax. It includes styling for the container, header, buttons, animations, and popup comments.

7. **Animation:**
   - The component includes a simple CSS animation (`@keyframes moveText`) for the animated text in the "animation-container."

8. **Popup Comments:**
   - Success or error messages for deposit and withdrawal actions are displayed in a styled manner at the bottom of the page.

This will creates a simple UI for interacting with an Ethereum smart contract representing an ATM. Users can connect their MetaMask wallet, view their account balance, and perform deposit and withdrawal actions with corresponding success/error messages.

**NOTE** :- YOU HAVE TO IMPORT AND USE ASSESSMENT.SOL IN INDEX.JS AND THEN DEPLOY BOTH THE CONTRACT USING DEPLOY.JS.

# How To Deploy

**You can use this project in your computer using steps mentioned below, in your terminal**

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

## Author

- [@raiyan-fr](https://www.github.com/raiyan-fr)

## License

The project is Licensed under [MIT License](https://choosealicense.com/licenses/mit/).
