const Freelancer = artifacts.require("freelancer");

module.exports = function (deployer) {
    deployer.deploy(Freelancer);
};
