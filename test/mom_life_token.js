
const weiDivider = Math.pow(10,18);

const MomLifeToken = artifacts.require("./MomLifeToken.sol");
const MomLifeInputWallet = artifacts.require("./MomLifeInputWallet.sol");
const MomLifeTestFakeContract = artifacts.require("./dev/MomLifeTestFakeContract.sol");


contract('MomLifeToken', function (accounts) {

    let addr = {
        "ownerAddress" : accounts[0],
        "parentAddress" : accounts[0],
        "fromAddress" : accounts[1],
        "otherAddress" : accounts[2],
        "parentableInputWallet": "0x0",
        "otherInputWallet": "0x0",
        "foreignInputWallet": "0x0"
    };

    let token;

    const getBalance = address => token.balanceOf(address).then(balance => balance.toNumber() / weiDivider);

    it("Should assert true", async function () {
        token = await MomLifeToken.deployed();
        assert.isTrue(true);
    });

    it("Create 10 000 000 000 tokens at the owner account", async function () {
        let ownerBalance = await token.balanceOf(addr.ownerAddress);
        assert.equal(ownerBalance, 10000000000 * weiDivider, "10 000 000 000 wasn't in the first account");
    });

    it('Check parentTransferableAddress', async function(){
        let parent = await token.parentTransferAddress();
        assert.equal(parent, addr.parentAddress, "Parent transfer address wrong!");
    });

    it('Should transfer tokens correctly', async function () {
        const amount = 10;

        let oneBefore = await getBalance(addr.ownerAddress);
        let twoBefore = await getBalance(addr.fromAddress);

        await token.transfer(addr.fromAddress, amount * weiDivider, {from: addr.ownerAddress});

        let oneAfter = await getBalance(addr.ownerAddress);
        let twoAfter = await getBalance(addr.fromAddress);

        assert.equal(oneBefore - amount, oneAfter, "Token transfer works wrong!");
        assert.equal(twoBefore + amount, twoAfter, "Token transfer works wrong!");
    });

    it('Create input wallet contract from parentAddress', async function() {
        const parentableInputWallet = await MomLifeInputWallet.new({"from": addr.parentAddress});
        let parentInputWalletOwner = await parentableInputWallet.owner();
        assert.equal(parentInputWalletOwner, addr.parentAddress, "Wrong owner of input wallet contract!");
        addr.parentableInputWallet = parentableInputWallet.address;
    });

    it('Create input wallet contract from otherAddress', async function() {
        const otherInputWallet = await MomLifeInputWallet.new({"from": addr.otherAddress});
        let otherInputWalletOwner = await otherInputWallet.owner();
        assert.equal(otherInputWalletOwner, addr.otherAddress, "Wrong owner of input wallet (other) contract!");
        addr.otherInputWallet = otherInputWallet.address;
    });

    it('Create foreign input wallet contract from otherAddress', async function() {
        const foreignInputWallet = await MomLifeTestFakeContract.new({"from": addr.otherAddress});
        try {
            let otherFakeInputWalletOwner = await foreignInputWallet.owner();
            assert.equal(true, false, "Foreign input wallet contract has owner!!!");
        } catch (e) {}
        addr.foreignInputWallet = foreignInputWallet.address;
        return true;
    });


    it('Should transfer tokens to parentableInputWallet(contract)', async function () {
        const amount = 2;

        const fromBefore = await getBalance(addr.fromAddress);
        const inputContractBefore = await getBalance(addr.parentableInputWallet);
        const parentBefore = await getBalance(addr.parentAddress);

        await token.transfer(addr.parentableInputWallet, amount * weiDivider, {from: addr.fromAddress});

        const fromAfter = await getBalance(addr.fromAddress);
        const inputContractAfter = await getBalance(addr.parentableInputWallet);
        const parentAfter = await getBalance(addr.parentAddress);

        assert.equal(fromBefore - amount, fromAfter,  "Token transfer works wrong! From balance wrong!");
        assert.equal(parentBefore + amount, parentAfter, "Token transfer works wrong! Parent balance wrong!");
        assert.equal(inputContractBefore, inputContractAfter, "Token transfer works wrong! Input contract wallet balance changed!");

        return true;
    });

    it('Should transfer tokens to other address', async function () {
        const amount = 2;

        const fromBefore = await getBalance(addr.fromAddress);
        const otherBefore = await getBalance(addr.otherAddress);
        const parentBefore = await getBalance(addr.parentAddress);

        await token.transfer(addr.otherAddress, amount * weiDivider, {from: addr.fromAddress});

        const fromAfter = await getBalance(addr.fromAddress);
        const otherAfter = await getBalance(addr.otherAddress);
        const parentAfter = await getBalance(addr.parentAddress);

        assert.equal(fromBefore - amount, fromAfter, "Token transfer works wrong! From balance wrong!");
        assert.equal(otherBefore  + amount, otherAfter, "Token transfer works wrong! Other balance wrong!");
        assert.equal(parentBefore, parentAfter, "Token transfer works wrong! Parent balance changed!");

        return true;
    });

    it('Should transfer tokens to otherInputWallet(contract)', async function () {
        const amount = 2;

        const fromBefore = await getBalance(addr.fromAddress);
        const otherContractBefore = await getBalance(addr.otherInputWallet);
        const parentBefore = await getBalance(addr.parentAddress);

        await token.transfer(addr.otherInputWallet, amount * weiDivider, {from: addr.fromAddress});

        const fromAfter = await getBalance(addr.fromAddress);
        const otherContractAfter = await getBalance(addr.otherInputWallet);
        const parentAfter = await getBalance(addr.parentAddress);

        assert.equal(fromBefore - amount,  fromAfter, "Token transfer works wrong! From balance wrong!");
        assert.equal(otherContractBefore  + amount, otherContractAfter, "Token transfer works wrong! Other contract wallet balance wrong!");
        assert.equal(parentBefore, parentAfter , "Token transfer works wrong! Parent balance changed!");

        return true;
    });

    it('Don\'t should transfer tokens to other foreignInputWallet(contract)', async function () {
        const amount = 2;

        const fromBefore = await getBalance(addr.fromAddress);
        const foreignContractBefore = await getBalance(addr.foreignInputWallet);
        const parentBefore = await getBalance(addr.parentAddress);
        const otherBefore = await getBalance(addr.otherAddress);

        await token.transfer(addr.foreignInputWallet, amount * weiDivider, {from: addr.fromAddress});

        const fromAfter = await getBalance(addr.fromAddress);
        const foreignContractAfter = await getBalance(addr.foreignInputWallet);
        const parentAfter = await getBalance(addr.parentAddress);
        const otherAfter = await getBalance(addr.otherAddress);

        assert.equal(fromBefore - amount,  fromAfter, "Token transfer works wrong! From balance wrong!");
        assert.equal(foreignContractBefore  + amount, foreignContractAfter, "Token transfer works wrong! Foreign contract wallet balance wrong!");
        assert.equal(parentBefore, parentAfter , "Token transfer works wrong! Parent balance changed!");

        return true;
    });

    it('Don\'t should transfer tokens (Insufficient funds)', async function () {
        const amount = 100;

        const oneBefore = await getBalance(addr.fromAddress);
        const twoBefore = await getBalance(addr.ownerAddress);

        try {
            await token.transfer(addr.fromAddress, amount * weiDivider, {from: addr.ownerAddress});
            assert.equal(true, false, "Transaction successful!!!");
        } catch (e) {
            return true;
        }

        const oneAfter = await getBalance(addr.fromAddress);
        const twoAfter = await getBalance(addr.ownerAddress);

        assert.equal(oneAfter, oneBefore, "From balance changed!");
        assert.equal(twoAfter, twoBefore, "To balance changed!");

        return true;
    });
});
