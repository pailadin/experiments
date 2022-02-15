<script lang="ts">
	import { assets } from '$app/paths';
	import { fade } from 'svelte/transition';

	let showModal = false;
	export let creatorData;

	function toggleModal() {
		showModal = !showModal;
	}
</script>

<button
	class="my-4 h-14 bg-[#A54ED5] text-white w-full rounded-full"
	type="button"
	on:click={toggleModal}>Support</button
>
{#if showModal}
	<div
		class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
	>
		<div transition:fade class="relative w-auto my-6 mx-auto max-w-[600px]">
			<div
				class="relative flex flex-col  border-0 rounded-lg shadow-lg bg-white outline-none focus:outline-none"
			>
				<button
					class="absolute top-0 right-0 m-4 hover:bg-black hover:bg-opacity-5 rounded-sm"
					type="button"
					on:click={toggleModal}
					><img src={`${assets}/icons/x-dark.svg`} alt="x-dark-icon" class="h-6" /></button
				>
				<div class="grow">
					<img
						src={creatorData.image_next.url}
						alt={creatorData.username}
						class="absolute -top-16 inset-x-0 mx-auto w-[125px] h-[125px] rounded-full outline outline-4 outline-offset-0 outline-white bg-white"
					/>
				</div>
				<div class="flex-none text-[24px] font-bold leading-[32px] mt-[90px]">
					Support @{creatorData.username}
				</div>
				<div class="flex-none px-[48px] py-[16px]">
					<div class="flex flex-row mb-[31px]">
						<div class="flex-none ">
							<img
								src={`${assets}/misc/mailbox.png`}
								alt="mailbox icon"
								width="64px"
								height="64px"
							/>
						</div>
						<div class="flex-1 pl-[28px]">
							<div class="flex flex-col items-start text-left">
								<div class="flex-none text-[20px] font-bold leading-[24px]">Follow</div>
								<div class="flex-none text-[16px] leading-[24px] text-[#79707D]">
									Get exclusive followers-only content straight to your inbox
								</div>
							</div>
						</div>
						<div class="flex-1 self-center">
							<button
								type="button"
								class="text-[16px] leading-[16px] mt-4 px-[24px] py-[16px] rounded-full border-solid border-[2px] border-[#E0E0E0] font-semibold"
								>Follow
							</button>
						</div>
					</div>

					<div class="flex flex-row mb-[31px]">
						<div class="flex-none">
							<img
								src={`${assets}/misc/moneybag.png`}
								alt="moneybag icon"
								width="64px"
								height="64px"
							/>
						</div>
						<div class="flex-1 pl-[28px]">
							<div class="flex flex-col items-start text-left">
								<div class="flex-none text-[20px] font-bold leading-[24px]">Send a tip</div>
								<div class="flex-none text-[16px] leading-[24px] text-[#79707D]">
									Support a creator with a one-time tip
								</div>
							</div>
						</div>
						<div class="flex-1 self-center">
							<button
								type="button"
								class="text-[16px] leading-[16px] mt-4 px-[24px] py-[16px] rounded-full bg-[#A54ED5] font-semibold text-white"
								>Send a tip
							</button>
						</div>
					</div>

					<div class="flex flex-row mb-[31px]">
						<div class="flex-none">
							<div class="h-[64px] w-[64px]">
								<img
									src={creatorData.image_next.url}
									alt="creator icon"
									width="64px"
									height="64px"
									class="rounded-full outline outline-[20px] outline-offset-0 outline-[#FFF1CF] bg-white h-[28px] w-[28px] m-[20px]"
								/>
							</div>
						</div>
						<div class="flex-1 pl-[28px]">
							<div class="flex flex-col items-start text-left">
								<div class="flex-none text-[20px] font-bold leading-[24px]">Buy creator coin</div>
								<div class="flex-none text-[16px] leading-[24px] text-[#79707D]">
									Get exclusive followers-only content straight to your inbox
								</div>
							</div>
						</div>
						<div class="flex-1 self-center">
							<button
								type="button"
								class="text-[16px] leading-[16px] mt-4 px-[24px] py-[16px] rounded-full border-solid border-[2px] border-[#E0E0E0] font-semibold"
								>Buy Coin
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}

<style>
</style>
