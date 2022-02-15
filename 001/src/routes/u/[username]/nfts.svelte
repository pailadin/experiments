<script lang="ts" context="module">
	import { client } from '$lib/client';
	import NftCard from '$lib/components/NftCard.svelte';
	import { PUBLIC_CREATOR_NFTS } from '$lib/graphql/queries/creator';
	import type { Load } from '@sveltejs/kit';

	let creatorProfile;

	export const load: Load = async ({ params }) => {
		const creatorUsername = params.username;

		creatorProfile = await client.query(PUBLIC_CREATOR_NFTS, {
			variables: {
				username: creatorUsername,
				isAuthenticated: false
			},
			fetchPolicy: 'no-cache'
		});

		return {
			props: { creatorProps: creatorProfile, creatorUname: creatorUsername }
		};
	};
</script>

<script lang="ts">
	export let creatorProps;
	export let creatorUname;
</script>

<svelte:head>
	<title>Jamclout - NFTs</title>
</svelte:head>

{#if creatorProps}
	{#if $creatorProps.loading}
		Loading {creatorUname}'s nfts...
	{:else if $creatorProps.error}
		Error: {$creatorProps.error.message}
	{:else}
		<div class="grid grid-cols-3 gap-4 max-w-fit mx-auto pt-12">
			{#if $creatorProps.data && $creatorProps.data.creatorAccount}
				{#each $creatorProps.data.creatorAccount.nfts.edges as nft}
					<NftCard
						nftData={nft}
						creator={{
							username: $creatorProps.data.creatorAccount.username,
							userDp: $creatorProps.data.creatorAccount.image_next.url
						}}
					/>
				{/each}
			{/if}
		</div>
	{/if}
{/if}
