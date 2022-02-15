<script lang="ts">
	export let topInvestors;
	let openTab = 1;

	function toggleTabs(tabNumber) {
		openTab = tabNumber;
	}
</script>

<div class="flex flex-wrap">
	<div class="w-full">
		<ul class="flex mb-0 list-none flex-wrap  flex-row border-b-2 border-b-slate-100">
			<li
				class="-mb-px mr-2 last:mr-0 flex-auto text-center {openTab === 1
					? 'font-bold border-b-4 border-b-[#A54ED5]'
					: 'font-normal border-b-0'}
						"
			>
				<p class="px-5 py-3 block leading-normal text-base hover:cursor-pointer" on:click={() => toggleTabs(1)}>
					Top investors
				</p>
			</li>
			<li
				class="-mb-px mr-2 last:mr-0 flex-auto text-center {openTab === 2
					? 'font-bold border-b-4 border-b-[#A54ED5]'
					: 'font-normal border-b-0'}"
			>
				<p class="px-5 py-3 block leading-normal text-base hover:cursor-pointer" on:click={() => toggleTabs(2)}>
					Top tippers
				</p>
			</li>
		</ul>
		<div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-4">
			<div class="flex-auto">
				<div class="tab-content tab-space">
					<div class={openTab === 1 ? 'block' : 'hidden'}>
						<div class="flex flex-col">
							{#if topInvestors.length > 0}
								{#each topInvestors as investor}
									<div class="flex flex-row justify-between mb-2">
										<div class="flex-none">
											<img
												src={investor.externalAccount.image}
												alt={investor.externalAccount.username}
												class="mx-auto w-[30px] h-[30px] rounded-full mr-4"
											/>
										</div>
										<div class="grow">
											<a sveltekit:prefetch href={`/u/${investor.externalAccount.username}`}
												>{investor.externalAccount.username}</a
											>
										</div>
										<div class="flex-none">$ {investor.holdings.toFixed(2)}</div>
									</div>
								{/each}
							{/if}
						</div>
					</div>
					<div class={openTab === 2 ? 'block' : 'hidden'}>
						<!-- to be filled -->
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
