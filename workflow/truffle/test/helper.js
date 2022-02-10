const { ADDRESS_ZERO } = require('./constants');

let execTransaction = async function(gnosisSafe, lw, utils, accounts, to, value, data, operation, message) {
  let nonce = await gnosisSafe.nonce()
  let transactionHash = await gnosisSafe.getTransactionHash(to, value, data, operation, 0, 0, 0, ADDRESS_ZERO, ADDRESS_ZERO, nonce)
  let sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)
  utils.logGasUsage(
      'execTransaction ' + message,
      await gnosisSafe.execTransaction(to, value, data, operation, 0, 0, 0, ADDRESS_ZERO, ADDRESS_ZERO, sigs, { from: accounts[0] })
  )
}

module.exports = {
  execTransaction
};

