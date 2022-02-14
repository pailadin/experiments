use clap::{App, Arg};
use hex_literal::hex;
use secp256k1::SecretKey;
use std::str::FromStr;
use std::time;
use std::time::Duration;
use web3::{
    contract::{Contract, Options},
    futures,
    futures::StreamExt,
    types::{Address, Bytes, FilterBuilder, TransactionParameters, H160, U256},
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
    let bytecode = include_str!("../../smart-contracts/build/MultisigWallet.bin").trim_end();

    let addresses: Vec<H160> = vec![my_account, account_two, account_three];

    // deploy erc20 to the node
    let _contract = Contract::deploy(
        web3.eth(),
        include_bytes!("../../smart-contracts/build/MultisigWallet.abi"),
    )?
    .confirmations(0)
    .options(Options::with(|opt| {
        opt.gas = Some(3_000_000.into());
    }))
    .execute(bytecode, (addresses, U256::from(3u64)), my_account)
    .await?;

    // return
    Ok(())
}

#[tokio::main]
async fn main() -> web3::contract::Result<()> {
    // command line parser
    let commandline_parser = App::new("Multisig Add Owner")
        .version("1.0")
        .author("alresarena2021@hov.co")
        .arg(
            Arg::with_name("contract_address")
                .help("Multisig contract address.")
                .required(true)
                .takes_value(true)
                .long("contract_address"),
        )
        .arg(
            Arg::with_name("new_owner")
                .help("new owner address.")
                .required(true)
                .takes_value(true)
                .long("new_owner"),
        )
        .get_matches();

    // init websockets protocol
    let http = web3::transports::Http::new("http://localhost:8545")?;
    let web3 = web3::Web3::new(http);
    // owner address
    let my_account: H160 = hex!("d028D24F16A8893bd078259D413372aC01580769").into();

    let account_two: H160 = hex!("75DF5695686338883675bB27BD06fC7578aA01b7").into();
    let account_three: H160 = hex!("bC1057A3Bb7A5650D4bE05F74837f872C1174E4c").into();

    // recepient address
    let new_owner: H160 =
        Address::from_str(commandline_parser.value_of("new_owner").unwrap()).unwrap();

    // contract address
    let contract_address: H160 =
        Address::from_str(commandline_parser.value_of("contract_address").unwrap()).unwrap();

    // get contract context
    let contract_json = Contract::from_json(
        web3.eth(),
        contract_address,
        include_bytes!("./MultisigWallet.abi"),
    )?;

    let mut result = contract_json.query("getOwners", (), None, Options::default(), None);
    // Make sure to specify the expected return type, to prevent ambiguous compiler
    // errors about `Detokenize` missing for `()`.
    let mut owner_list: Vec<H160> = result.await?;

    println!("owner: {:?}", owner_list);

    let tx_object = TransactionParameters {
        to: Some(new_owner),
        value: U256::exp10(0), //0.1 eth
        ..Default::default()
    };

    let prvk =
        SecretKey::from_str("90b1498fcac1911f91cd650dd4091b36d32e728eb8c5be611af35e3d3e04dd7d")
            .unwrap();

    let sign_transaction = web3.accounts().sign_transaction(tx_object, &prvk).await?;
    // initiate transfer
    contract_json
        .call(
            "proposeAddOwner",
            (
                new_owner,
                Bytes::from("0xdf32340000000000000000000000000000000000000000000000000000000000"),
            ),
            my_account,
            Options::default(),
        )
        .await?;

    // contract_json
    //     .call("confirmTransaction", (0,), account_two, Options::default())
    //     .await?;

    // contract_json
    //     .call(
    //         "confirmTransaction",
    //         (0,),
    //         account_three,
    //         Options::default(),
    //     )
    //     .await?;

    let confirmation = contract_json.call(
        "getConfirmationCount",
        (0u64,),
        my_account,
        Options::default(),
    );
    // Make sure to specify the expected return type, to prevent ambiguous compiler
    // errors about `Detokenize` missing for `()`.
    let confirmation_data = confirmation.await?;

    println!("confirmations: {:?}", confirmation_data);

    Ok(())
}
