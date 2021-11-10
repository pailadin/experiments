use clap::{App, Arg};
use hex_literal::hex;
use std::str::FromStr;
use std::time;
use std::time::Duration;
use web3::{
    contract::{Contract, Options},
    futures,
    futures::StreamExt,
    types::{Address, FilterBuilder, H160, U256},
};

async fn _install_contract() -> web3::contract::Result<()> {
    let http = web3::transports::Http::new("http://localhost:8545")?;
    let web3 = web3::Web3::new(http);

    let my_account: H160 = hex!("d028D24F16A8893bd078259D413372aC01580769").into();

    let bytecode = include_str!("./build/ERC20.bin").trim_end();

    let _contract = Contract::deploy(web3.eth(), include_bytes!("./build/ERC20.abi"))?
        .confirmations(0)
        .options(Options::with(|opt| {
            opt.gas = Some(3_000_000.into());
        }))
        .execute(
            bytecode,
            (
                "MY TOKENS".to_owned(),
                "MT".to_owned(),
                U256::from(1000u64),
                my_account,
            ),
            my_account,
        )
        .await?;

    Ok(())
}

#[tokio::main]
async fn main() -> web3::contract::Result<()> {
    let commandline_parser = App::new("ERC20 TRANSFER TOKEN VERFIER")
        .version("1.0")
        .author("alresarena2021@hov.co")
        .arg(
            Arg::with_name("contract_address")
                .help("ERC20 contract address.")
                .required(true)
                .takes_value(true)
                .long("contract_address"),
        )
        .arg(
            Arg::with_name("owner")
                .help("address of contract owner.")
                .required(true)
                .takes_value(true)
                .long("owner"),
        )
        .arg(
            Arg::with_name("recepient")
                .help("recepient address.")
                .required(true)
                .takes_value(true)
                .long("recepient"),
        )
        .arg(
            Arg::with_name("amount")
                .help("amount to be transferred.")
                .required(true)
                .takes_value(true)
                .long("amount"),
        )
        .get_matches();

    // _install_contract().await?;
    let web3 = web3::Web3::new(web3::transports::WebSocket::new("ws://localhost:8545").await?);

    let my_account: H160 =
        Address::from_str(commandline_parser.value_of("owner").unwrap()).unwrap();
    let recepient: H160 =
        Address::from_str(commandline_parser.value_of("recepient").unwrap()).unwrap();

    let contract_address: H160 =
        Address::from_str(commandline_parser.value_of("contract_address").unwrap()).unwrap();
    let contract_json = Contract::from_json(
        web3.eth(),
        contract_address,
        include_bytes!("./build/ERC20.abi"),
    )?;

    let result = contract_json.query("balanceOf", (my_account,), None, Options::default(), None);
    let balance_of: U256 = result.await?;
    println!("Current Balance: {}", balance_of);

    let filter = FilterBuilder::default()
        .address(vec![contract_address])
        .topics(
            Some(vec![hex!(
                "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            )
            .into()]),
            None,
            None,
            None,
        )
        .build();

    let filter = web3.eth_filter().create_logs_filter(filter).await?;

    let logs_stream = filter.stream(time::Duration::from_secs(1));
    futures::pin_mut!(logs_stream);

    let data = contract_json
        .call(
            "transfer",
            (
                recepient,
                U256::from(
                    commandline_parser
                        .value_of("amount")
                        .unwrap()
                        .parse::<u64>()
                        .unwrap(),
                ),
            ),
            my_account,
            Options::default(),
        )
        .await?;

    println!("txn: {:?}", data);

    let duration = Duration::from_secs(60 * 30);

    match tokio::time::timeout(duration, logs_stream.next()).await {
        Ok(data) => {
            println!("{:?}", data);
            println!("Transaction Verified.");

            let result =
                contract_json.query("balanceOf", (my_account,), None, Options::default(), None);
            let balance_of: U256 = result.await?;
            println!("New Balance: {}", balance_of);

            std::process::exit(0);
        }

        Err(_) => {
            println!("Transaction Unverified.");
            std::process::exit(-1);
        }
    }
}
