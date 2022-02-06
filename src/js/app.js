var abi = JSON.parse('[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_addedBy","type":"address"},{"indexed":false,"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"AddFile","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"addFile","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"getFileOrigin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_originAddress","type":"address"},{"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"verifyFileOrigin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]');
const address = '0xAa9C2d018CB62f8Ba3e5041cE095f86fA325bA8c';
const forwarderOrigin = 'http://localhost:3000';
var originAddress;
var hash;
var provider;
var signer;
var contract;

document.addEventListener("DOMContentLoaded", function (event) {

    const onboardButton = document.getElementById('connect-wallet');

    const isMetaMaskInstalled = () => {
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };

    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

    const onClickInstall = () => {
        onboardButton.innerText = 'Onboarding in progress';
        onboardButton.disabled = true;
        onboarding.startOnboarding();
    };

    const onClickConnect = async () => {
        try {
            onboardButton.disabled = true;
            await ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error(error);
        }
        handleAccountsConnected();
    };

    const handleAccountsConnected = async () => {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length < 1) {
            onboardButton.disabled = false;
            document.getElementById("connected-wallet").innerText = "Connected wallet: ";
            document.getElementById("connected-wallet").hidden = true;
            document.getElementById("verify-file").disabled = true;
            document.getElementById("get-origin").disabled = true;
            document.getElementById("ver-address").disabled = true;
            document.getElementById("add-file").disabled = true;
        }
        else {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            document.getElementById("connected-wallet").innerText = accounts[0] || 'Not able to get accounts';
            document.getElementById("connected-wallet").hidden = false;
            
            //polygon mumbai
            if(window.ethereum.networkVersion != 80001){
                alert("Wrong chain! Change to Polygon Mumbai Testnet please.");
                document.getElementById("verify-file").disabled = true;
                document.getElementById("get-origin").disabled = true;
                document.getElementById("ver-address").disabled = true;
                document.getElementById("add-file").disabled = true;
            }
            else{
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                contract = new ethers.Contract(address, abi, signer);
                onboardButton.disabled = true;
                onboardButton.innerText = "Connected";
                document.getElementById("verify-file").disabled = false;
                document.getElementById("get-origin").disabled = false;
                document.getElementById("ver-address").disabled = false;
                document.getElementById("add-file").disabled = false;
            }
        }
    }

    const MetaMaskClientCheck = async () => {
        if (!isMetaMaskInstalled()) {
            onboardButton.innerText = 'Click to install MetaMask!';
            onboardButton.onclick = onClickInstall;
            onboardButton.disabled = false;
        } else {
            onboardButton.innerText = 'Connect Wallet';
            onboardButton.onclick = onClickConnect;
            onboardButton.disabled = false;
            const accounts = ethereum.request({ method: 'eth_accounts' });
            if (accounts == undefined) {
            }
            else {
                handleAccountsConnected();
            }
        }
    };

    MetaMaskClientCheck();
    
    ethereum.on("chainChanged", () => window.location.reload());

    ethereum.on("message", (message) => alert(message));

    ethereum.on("disconnect", (error) => {
        alert(`Disconnected from network ${error}`);
    });

    ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
            console.log(`Using account ${accounts[0]}`);
        } else {
            handleAccountsConnected();
        }
    });

    document.getElementById("verify-file").addEventListener("click", function () {
        if (hash != undefined) {
            if(document.getElementById('ver-address').value !== ''){
                originAddress = document.getElementById('ver-address').value;
    
                contract.verifyFileOrigin(originAddress, hash)
                    .then((bool) => {
                        if (bool == true) {
                            document.getElementById("verification").innerText = 'File is verified!'
                            document.getElementById("verification").style.color = "#006400";
                            document.getElementById("verification").hidden = false;
                        }
                    })
                    .catch(() => {
                        document.getElementById("verification").innerText = 'File is unverified!';
                        document.getElementById("verification").style.color = "#ff0000";
                        document.getElementById("verification").hidden = false;
                    });
                return;
            }
            else{
                document.getElementById("verification").innerText = 'No address of origin.';
                document.getElementById("verification").style.color = "#ff0000";
                document.getElementById("verification").hidden = false;
            }
        } else {
            document.getElementById("verification").innerText = 'No file selected. Please choose file first.';
            document.getElementById("verification").style.color = "#ff0000";
            document.getElementById("verification").hidden = false;
        }
    });

    document.getElementById("get-origin").addEventListener("click", function () {
        if (hash != undefined) {
            contract.getFileOrigin(hash)
                .then((address) => document.getElementById("ver-address").value = address, originAddress = hash)
                .catch(() => {
                    document.getElementById("origin-address-verification").hidden = false;
                    document.getElementById("origin-address-verification").innerText = "Hash not found in the blockchain.";
                    document.getElementById("origin-address-verification").style.color = "#ff0000";
                });
        } else {
            document.getElementById("origin-address-verification").hidden = false;
            document.getElementById("origin-address-verification").innerText = "No file selected. Please choose file first.";
            document.getElementById("origin-address-verification").style.color = "#ff0000";
        }
    });

    document.getElementById("add-file").addEventListener("click", function () {
        if (hash != undefined) {
            contract.addFile(hash)
                .then((tx) => {
                    document.getElementById("file-stored").innerText = "Done! Tx: " + tx.hash;
                    document.getElementById("file-stored").style.color = "#006400";
                    document.getElementById("file-stored").hidden = false;
                    return tx.wait().then(() => {
                        document.getElementById("file-stored").innerText = "Successfully stored hash in the blockchain.";
                    }).catch((err) =>
                        console.log(err.data.message)
                    );
                })
                .catch((err) => {
                    console.log(err.data.message);
                    document.getElementById("file-stored").innerText = "File already stored!";
                    document.getElementById("file-stored").style.color = "#ff0000";
                    document.getElementById("file-stored").hidden = false;
                }
            );
        } else {
            document.getElementById("file-stored").innerText = "No file selected. Please choose file first.";
            document.getElementById("file-stored").style.color = "#ff0000";
            document.getElementById("file-stored").hidden = false;
        }
    });
});


async function fileUpload() {
    const finput = document.getElementById('file-input');
    const file = finput.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    document.getElementById("file-hash").innerHTML = `File Hash: ${hash}`;
    hash = `0x${hash}`;
    document.getElementById("origin-address-verification").hidden = true;
    document.getElementById("verification").hidden = true;
    document.getElementById("file-stored").hidden = true;
    document.getElementById('ver-address').value = '';
}