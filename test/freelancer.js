const Freelancer = artifacts.require("Freelancer");

contract("Freelancer", (accounts) => {
  let freelancer;
  let owner, client, anotherClient;

  const freelancer1 = "0x04B56F34B5c55a7A3B37B7a4672BbAeD787657eb";
  const freelancer2 = "0x17819B9a9144A9F4f19e706a4BA97f8032338D74";
  const freelancer3 = "0xA9905AA74AA0a3518b0De3DF52dc87cD9B58Ef5E";

  const COST_1 = web3.utils.toWei("1", "ether");
  const COST_2 = web3.utils.toWei("0.5", "ether");
  const COST_3 = web3.utils.toWei("0.3", "ether");

  before(async () => {
    owner = accounts[0];
    client = accounts[1];
    anotherClient = accounts[2];
    freelancer = await Freelancer.new({ from: owner });

    // Fund freelancers (optional, just for testing balances)
    await Promise.all([
      web3.eth.sendTransaction({ from: owner, to: freelancer1, value: web3.utils.toWei("10", "ether") }),
      web3.eth.sendTransaction({ from: owner, to: freelancer2, value: web3.utils.toWei("10", "ether") }),
      web3.eth.sendTransaction({ from: owner, to: freelancer3, value: web3.utils.toWei("10", "ether") })
    ]);
  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      assert.equal(await freelancer.owner(), owner);
    });

    it("Pre-populates packages correctly", async () => {
      const package1 = await freelancer.packages(1);
      assert.equal(package1.freelancer, freelancer1);
      assert.equal(package1.cost.toString(), COST_1);
    });
  });

  describe("Hiring Process", () => {
    it("Stores funds in escrow when hired", async () => {
      await freelancer.hire(1, { from: client, value: COST_1 });
      assert.equal((await freelancer.getEscrowAmount(1)).toString(), COST_1);
    });

    it("Prevents duplicate hires", async () => {
      await freelancer.hire(2, { from: client, value: COST_2 });
      try {
        await freelancer.hire(2, { from: client, value: COST_2 });
        assert.fail("Should have reverted");
      } catch (error) {
        assert.include(error.message, "Package already hired");
      }
    });
  });

  describe("Payment Approval", () => {
    beforeEach(async () => {
      freelancer = await Freelancer.new({ from: owner });
      await freelancer.hire(3, { from: client, value: COST_3 });
    });

    it("Allows only the hiring client to approve payment", async () => {
      const initialBalance = BigInt(await web3.eth.getBalance(freelancer3));
      await freelancer.approvePayment(3, { from: client }); // Client approves
      const finalBalance = BigInt(await web3.eth.getBalance(freelancer3));
      assert.equal((finalBalance - initialBalance).toString(), COST_3);
    });

    it("Rejects payment approval from non-client", async () => {
      try {
        await freelancer.approvePayment(3, { from: anotherClient }); // Wrong client
        assert.fail("Should have reverted");
      } catch (error) {
        assert.include(error.message, "Only the client who hired this package can approve payment");
      }
    });

    it("Allows re-hiring after approval", async () => {
      await freelancer.approvePayment(3, { from: client });
      await freelancer.hire(3, { from: anotherClient, value: COST_3 }); // New client can hire
      assert.equal((await freelancer.getEscrowAmount(3)).toString(), COST_3);
    });
  });
});