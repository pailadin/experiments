use hex_literal::hex;
use web3::{
    contract::{Contract, Options},
    types::{H160, U256},
};

async fn _install_contract() -> web3::contract::Result<()> {
    // init http protocol
    let http = web3::transports::Http::new("http://localhost:8545")?;
    let web3 = web3::Web3::new(http);

    // owner address
    let my_account: H160 = hex!("d028D24F16A8893bd078259D413372aC01580769").into();
    let account_two: H160 = hex!("75DF5695686338883675bB27BD06fC7578aA01b7").into();
    let account_three: H160 = hex!("bC1057A3Bb7A5650D4bE05F74837f872C1174E4c").into();

    // erc20 binary
    let bytecode = include_str!("./MultisigWallet.bin").trim_end();

    let addresses: Vec<H160> = vec![my_account, account_two, account_three];

    // deploy erc20 to the node
    let _contract = Contract::deploy(web3.eth(), include_bytes!("./MultisigWallet.abi"))?
        .confirmations(1)
        .options(Options::with(|opt| {
            opt.gas = Some(3_000_000.into());
        }))
        .execute(bytecode, (addresses, U256::from(3u64)), my_account)
        .await?;

    let result = _contract.query("getOwners", (), None, Options::default(), None);
    // Make sure to specify the expected return type, to prevent ambiguous compiler
    // errors about `Detokenize` missing for `()`.
    let owner_list: Vec<H160> = result.await?;

    println!("owner: {:?}", owner_list);
    // return
    Ok(())
}

#[tokio::main]
async fn main() -> web3::contract::Result<()> {
    _install_contract().await?;

    Ok(())
}
