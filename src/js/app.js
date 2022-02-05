var abi = JSON.parse('[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_addedBy","type":"address"},{"indexed":false,"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"AddFile","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"addFile","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"getFileOrigin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_originAddress","type":"address"},{"internalType":"bytes32","name":"_fileHash","type":"bytes32"}],"name":"validateFileOrigin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]');

const address = '0x45F0655e31002d32b58d6f9e985eE3ED01B769C1';

var originAddress;
var file_hash = "0x688787d8ff144c502c7f5cffaafe2cc588d86079f9de88304c26b0cb99ce91c6";

var hash;

document.addEventListener("DOMContentLoaded", function (event) {

    if (window.ethereum) {
        ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);

        document.getElementById("verify-file").addEventListener("click", function () {
            if (hash != undefined) {
                originAddress = document.getElementById('ver-address').value;
                console.log("originAddress: " + originAddress);

                contract.validateFileOrigin(originAddress, hash)
                    .then(document.getElementById("verification").innerText = 'File is verified!')
                    .catch(() => alert("Selected file is not stored"));
                return;
            } else {
                alert("You have to select file for the verification!");
            }
        });

        document.getElementById("get-origin").addEventListener("click", function () {
            if (hash != undefined) {
                contract.getFileOrigin(hash)
                    .then((address) => document.getElementById("origin-address-verification").innerText = address, originAddress = hash)
                    .catch(() => alert("Selected file is not stored"));
            } else {
                alert("You have to select file for the verification!");
            }
        });

        document.getElementById("add-file").addEventListener("click", function () {
            if (hash != undefined) {
                contract.addFile(hash)
                    .then((tx) => {
                        console.log("Transaction occured: ", tx.hash);
                        return tx.wait().then(() => {
                            // document.getElementById("hash").innerHTML = hash;
                            alert(`Successfully added hash of the file to the blockchain: ${hash} `);
                            console.log(`added file: ${hash}`);

                        }).catch((err) => alert(err.data.message));
                    })
                    .catch((err) => alert(err.data.message));
            } else {
                alert("You have to select file for the verification!");
            }
        });

    } else {
        alert("U have to install MetaMask first!");
    }
});


async function fileUpload() {
    const finput = document.getElementById('fileinput');
    const file = finput.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array

    hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    hash = `0x${hash}`;
    document.getElementById("upload-hash").innerHTML = `Hash of your file: ${hash}`;
    document.getElementById("verification").innerHTML = "";
    document.getElementById("ver-address").value = "";
    document.getElementById("origin-address-verification").innerHTML = "";

    console.log(hash);
}


