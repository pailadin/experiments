//! Program state processor

use crate::{
    error::TokenError,
    instruction::{is_valid_signer_index, AuthorityType, TokenInstruction, MAX_SIGNERS},
    state::{Account, AccountState, Mint, Multisig},
};
use num_traits::FromPrimitive;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    decode_error::DecodeError,
    entrypoint::ProgramResult,
    msg,
    program_error::{PrintProgramError, ProgramError},
    program_option::COption,
    program_pack::{IsInitialized, Pack},
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
};

/// Program state handler.
pub struct Processor {}
impl Processor {
    fn _process_initialize_multisig(
        accounts: &[AccountInfo],
        threshold: u8,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let multisig_info = next_account_info(account_info_iter)?;
        let multisig_info_data_len = multisig_info.data_len();
        

        let mut multisig = Multisig::unpack_unchecked(&multisig_info.data.borrow())?;
        if multisig.is_initialized {
            return Err(TokenError::AlreadyInUse.into());
        }

        if !rent.is_exempt(multisig_info.lamports(), multisig_info_data_len) {
            return Err(TokenError::NotRentExempt.into());
        }

        let owners = account_info_iter.as_slice();
        multisig.threshold = threshold;
        multisig.owners = owners;
        multisig.is_initialized = true;

        Multisig::pack(multisig, &mut multisig_info.data.borrow_mut())?;

        Ok(())
    }

   
    pub fn process_transfer(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount: u64,
        expected_decimals: Option<u8>,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let source_account_info = next_account_info(account_info_iter)?;

        let expected_mint_info = if let Some(expected_decimals) = expected_decimals {
            Some((next_account_info(account_info_iter)?, expected_decimals))
        } else {
            None
        };

        let dest_account_info = next_account_info(account_info_iter)?;
        let authority_info = next_account_info(account_info_iter)?;

        let mut source_account = Account::unpack(&source_account_info.data.borrow())?;
        let mut dest_account = Account::unpack(&dest_account_info.data.borrow())?;

        if source_account.is_frozen() || dest_account.is_frozen() {
            return Err(TokenError::AccountFrozen.into());
        }
        if source_account.amount < amount {
            return Err(TokenError::InsufficientFunds.into());
        }
        if source_account.mint != dest_account.mint {
            return Err(TokenError::MintMismatch.into());
        }

        if let Some((mint_info, expected_decimals)) = expected_mint_info {
            if source_account.mint != *mint_info.key {
                return Err(TokenError::MintMismatch.into());
            }

            let mint = Mint::unpack(&mint_info.data.borrow_mut())?;
            if expected_decimals != mint.decimals {
                return Err(TokenError::MintDecimalsMismatch.into());
            }
        }

        let self_transfer = source_account_info.key == dest_account_info.key;

        match source_account.delegate {
            COption::Some(ref delegate) if authority_info.key == delegate => {
                Self::validate_owner(
                    program_id,
                    delegate,
                    authority_info,
                    account_info_iter.as_slice(),
                )?;
                if source_account.delegated_amount < amount {
                    return Err(TokenError::InsufficientFunds.into());
                }
                if !self_transfer {
                    source_account.delegated_amount = source_account
                        .delegated_amount
                        .checked_sub(amount)
                        .ok_or(TokenError::Overflow)?;
                    if source_account.delegated_amount == 0 {
                        source_account.delegate = COption::None;
                    }
                }
            }
            _ => Self::validate_owner(
                program_id,
                &source_account.owner,
                authority_info,
                account_info_iter.as_slice(),
            )?,
        };

     
        if self_transfer {
            return Ok(());
        }

        source_account.amount = source_account
            .amount
            .checked_sub(amount)
            .ok_or(TokenError::Overflow)?;
        dest_account.amount = dest_account
            .amount
            .checked_add(amount)
            .ok_or(TokenError::Overflow)?;

        if source_account.is_native() {
            let source_starting_lamports = source_account_info.lamports();
            **source_account_info.lamports.borrow_mut() = source_starting_lamports
                .checked_sub(amount)
                .ok_or(TokenError::Overflow)?;

            let dest_starting_lamports = dest_account_info.lamports();
            **dest_account_info.lamports.borrow_mut() = dest_starting_lamports
                .checked_add(amount)
                .ok_or(TokenError::Overflow)?;
        }

        Account::pack(source_account, &mut source_account_info.data.borrow_mut())?;
        Account::pack(dest_account, &mut dest_account_info.data.borrow_mut())?;

        Ok(())
    }

   
    pub fn process_approve(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let source_account_info = next_account_info(account_info_iter)?;

        let expected_mint_info = if let Some(expected_decimals) = expected_decimals {
            Some((next_account_info(account_info_iter)?, expected_decimals))
        } else {
            None
        };
        let delegate_info = next_account_info(account_info_iter)?;
        let owner_info = next_account_info(account_info_iter)?;

        let mut source_account = Account::unpack(&source_account_info.data.borrow())?;

        if source_account.is_frozen() {
            return Err(TokenError::AccountFrozen.into());
        }

        if let Some((mint_info, expected_decimals)) = expected_mint_info {
            if source_account.mint != *mint_info.key {
                return Err(TokenError::MintMismatch.into());
            }

            let mint = Mint::unpack(&mint_info.data.borrow_mut())?;
            if expected_decimals != mint.decimals {
                return Err(TokenError::MintDecimalsMismatch.into());
            }
        }

        Self::validate_owner(
            program_id,
            &source_account.owner,
            owner_info,
            account_info_iter.as_slice(),
        )?;

        source_account.delegate = COption::Some(*delegate_info.key);
        source_account.delegated_amount = amount;

        Account::pack(source_account, &mut source_account_info.data.borrow_mut())?;

        Ok(())
    }

   
    pub fn process_revoke(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let source_account_info = next_account_info(account_info_iter)?;

        let mut source_account = Account::unpack(&source_account_info.data.borrow())?;

        let owner_info = next_account_info(account_info_iter)?;

        if source_account.is_frozen() {
            return Err(TokenError::AccountFrozen.into());
        }

        Self::validate_owner(
            program_id,
            &source_account.owner,
            owner_info,
            account_info_iter.as_slice(),
        )?;

        source_account.delegate = COption::None;
        source_account.delegated_amount = 0;

        Account::pack(source_account, &mut source_account_info.data.borrow_mut())?;

        Ok(())
    }

   
    

    /// Processes an [Instruction](enum.Instruction.html).
    pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], input: &[u8]) -> ProgramResult {
        let instruction = TokenInstruction::unpack(input)?;

        match instruction {
           
            TokenInstruction::InitializeAccount => {
                msg!("Instruction: InitializeAccount");
                Self::process_initialize_account(accounts)
            }
            
            TokenInstruction::InitializeMultisig { m } => {
                msg!("Instruction: InitializeMultisig");
                Self::process_initialize_multisig(accounts, m)
            }
           
            TokenInstruction::Transfer { amount } => {
                msg!("Instruction: Transfer");
                Self::process_transfer(program_id, accounts, amount, None)
            }
            TokenInstruction::Approve { amount } => {
                msg!("Instruction: Approve");
                Self::process_approve(program_id, accounts, amount, None)
            }
            TokenInstruction::Revoke => {
                msg!("Instruction: Revoke");
                Self::process_revoke(program_id, accounts)
            }
           
        }
    }


impl PrintProgramError for TokenError {
    fn print<E>(&self)
    where
        E: 'static + std::error::Error + DecodeError<E> + PrintProgramError + FromPrimitive,
    {
        match self {
            TokenError::NotRentExempt => msg!("Error: Lamport balance below rent-exempt threshold"),
            TokenError::InsufficientFunds => msg!("Error: insufficient funds"),
            TokenError::InvalidMint => msg!("Error: Invalid Mint"),
            TokenError::MintMismatch => msg!("Error: Account not associated with this Mint"),
            TokenError::OwnerMismatch => msg!("Error: owner does not match"),
            TokenError::FixedSupply => msg!("Error: the total supply of this token is fixed"),
            TokenError::AlreadyInUse => msg!("Error: account or token already in use"),
            TokenError::InvalidNumberOfProvidedSigners => {
                msg!("Error: Invalid number of provided signers")
            }
            TokenError::InvalidNumberOfRequiredSigners => {
                msg!("Error: Invalid number of required signers")
            }
            TokenError::UninitializedState => msg!("Error: State is uninitialized"),
            TokenError::NativeNotSupported => {
                msg!("Error: Instruction does not support native tokens")
            }
            TokenError::NonNativeHasBalance => {
                msg!("Error: Non-native account can only be closed if its balance is zero")
            }
            TokenError::InvalidInstruction => msg!("Error: Invalid instruction"),
            TokenError::InvalidState => msg!("Error: Invalid account state for operation"),
            TokenError::Overflow => msg!("Error: Operation overflowed"),
            TokenError::AuthorityTypeNotSupported => {
                msg!("Error: Account does not support specified authority type")
            }
            TokenError::MintCannotFreeze => msg!("Error: This token mint cannot freeze accounts"),
            TokenError::AccountFrozen => msg!("Error: Account is frozen"),
            TokenError::MintDecimalsMismatch => {
                msg!("Error: decimals different from the Mint decimals")
            }
            TokenError::NonNativeNotSupported => {
                msg!("Error: Instruction does not support non-native tokens")
            }
        }
    }
}
