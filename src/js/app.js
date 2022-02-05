var abi = JSON.parse('[ {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_addedBy","type":"address"},{"indexed":false,"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"AddFile","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"addFile","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"getFileOrigin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_originAddress","type":"address"},{"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"validateFileOrigin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"} ]');

const address = '0xA01E57e18C5efb0b3f8e4643846956F550992846';

var origin_address;
var file_hash = "0x688787d8ff144c502c7f5cffaafe2cc588d86079f9de88304c26b0cb99ce91c6";

document.addEventListener("DOMContentLoaded", function (event) {

    if (window.ethereum) {

        ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        const contract = new ethers.Contract(address, abi, signer);

        document.getElementById("verify-file").addEventListener("click", function () {
            contract.getFileOrigin(file_hash).then((bool) => document.getElementById("verification").innerText = bool)
                .catch((err) => console.error(err));
        });

        document.getElementById("get-origin").addEventListener("click", function () {
            contract.getFileOrigin(file_hash).then((file_hash) => document.getElementById("origin-address").innerText = file_hash, origin_address = file_hash)
                .catch((err) => console.error(err));
        });

        document.getElementById("add-file").addEventListener("click", function () {
            contract.addFile(file_hash)
                .then((tx) => {
                    console.log("Transaction occured: ", tx.hash);
                    return tx.wait().then(() => {
                        document.getElementById("hash").innerHTML = file_hash;
                        console.log("added file");
                    }).catch((err) => console.error(err.message));
                })
                .catch((err) => console.error(err.message));
        });
    } else {
        console.error("Install MetaMask.");
    }
});