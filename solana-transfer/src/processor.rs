//! Program instruction processor

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    pubkey::Pubkey,
};

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
   
    // account interation
    let account_info_iter = &mut accounts.iter();

    // source account
    let source_info = next_account_info(account_info_iter)?;

    // destination account
    let destination_info = next_account_info(account_info_iter)?;

    // subtract source account balance as way of transfer 
    **source_info.try_borrow_mut_lamports()? -= 5;
    
    // add destination account balance as way of transfer
    **destination_info.try_borrow_mut_lamports()? += 5;

    Ok(())
}
