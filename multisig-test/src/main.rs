use hex_literal::hex;
use web3::{
    contract::{Contract, Options},
   
    types::{ Bytes,  H160, U256, H256},
};

async fn install_contract() -> web3::contract::Result<()> {
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

    // return
    Ok(())
}

async fn add_owner(contract_address: H160) -> web3::contract::Result<()> {
    let http = web3::transports::Http::new("http://localhost:8545")?;
    let web3 = web3::Web3::new(http);
    // owner address
    let my_account: H160 = hex!("d028D24F16A8893bd078259D413372aC01580769").into();
    let account_two: H160 = hex!("75DF5695686338883675bB27BD06fC7578aA01b7").into();
    let account_three: H160 = hex!("bC1057A3Bb7A5650D4bE05F74837f872C1174E4c").into();

    // recepient address
    let new_owner: H160 = hex!("77c7f75a99776bf1cFff0F025D8b2BE91770808e").into();

    // contract address

    // get contract context
    let contract_json = Contract::from_json(
        web3.eth(),
        contract_address,
        include_bytes!("./MultisigWallet.abi"),
    )?;


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

    contract_json
        .call("confirmTransaction", (0,), account_two, Options::default())
        .await?;

    contract_json
        .call(
            "confirmTransaction",
            (0,),
            account_three,
            Options::default(),
        )
        .await?;

    contract_json
        .call("executeTransaction", (0,), my_account, Options::default())
        .await?;

    

    Ok(())
}


async fn remove_owner(contract_address: H160) -> web3::contract::Result<()> {
    let http = web3::transports::Http::new("http://localhost:8545")?;
    let web3 = web3::Web3::new(http);
    // owner address
    let my_account: H160 = hex!("d028D24F16A8893bd078259D413372aC01580769").into();
    let account_two: H160 = hex!("75DF5695686338883675bB27BD06fC7578aA01b7").into();
    let account_three: H160 = hex!("bC1057A3Bb7A5650D4bE05F74837f872C1174E4c").into();

    // recepient address
    let target_owner: H160 = hex!("77c7f75a99776bf1cFff0F025D8b2BE91770808e").into();

    // contract address

    // get contract context
    let contract_json = Contract::from_json(
        web3.eth(),
        contract_address,
        include_bytes!("./MultisigWallet.abi"),
    )?;


    contract_json
        .call(
            "proposeRemoveOwner",
            (
                target_owner,
                Bytes::from("0xdf32340000000000000000000000000000000000000000000000000000000000"),
            ),
            my_account,
            Options::default(),
        )
        .await?;

    contract_json
        .call("confirmTransaction", (0,), account_two, Options::default())
        .await?;

    contract_json
        .call(
            "confirmTransaction",
            (0,),
            account_three,
            Options::default(),
        )
        .await?;

    contract_json
        .call("executeTransaction", (0,), my_account, Options::default())
        .await?;
    Ok(())
}


async fn get_owner_count(contract_address: H160) -> H256 {
    let http = web3::transports::Http::new("http://localhost:8545")?;
    let web3 = web3::Web3::new(http);
    // owner address
    let my_account: H160 = hex!("d028D24F16A8893bd078259D413372aC01580769").into();
   
    // get contract context
    let contract_json = Contract::from_json(
        web3.eth(),
        contract_address,
        include_bytes!("./MultisigWallet.abi"),
    )?;

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

    Ok(confirmation_data)
}


#[tokio::main]
async fn main() -> web3::contract::Result<()> {
    install_contract().await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use web3::types::H256;

    use super::*;

    #[tokio::test]
    async fn test_add_owner() {
        let contract_address: H160 = hex!("77c7f75a99776bf1cFff0F025D8b2BE91770808e").into();
        let expected_count: H160 = hex!("bC1057A3Bb7A5650D4bE05F74837f872C1174E4c").into();

        add_owner(contract_address).await;
       
        assert!(get_owner_count(contract_address) == expected_count);
    }

    #[tokio::test]
    async fn test_remove_owner() {
        let contract_address: H160 = hex!("77c7f75a99776bf1cFff0F025D8b2BE91770808e").into();
        let expected_count: H160 = hex!("bC1057A3Bb7A5650D4bE05F74837f872C1174E4c").into();

        remove_owner(contract_address).await;
        assert!(get_owner_count(contract_address) == expected_count);
    }
}
