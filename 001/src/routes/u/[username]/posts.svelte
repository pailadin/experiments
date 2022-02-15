<script lang="ts" context="module">
	import { client } from '$lib/client';
	import PostCard from '$lib/components/PostCard.svelte';
	import { GET_CREATOR_POSTS_WITHOUT_AUTH } from '$lib/graphql/queries/creator';
	import type { Load } from '@sveltejs/kit';

	let creatorProfile;

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ params }) => {
		const creatorUsername = params.username;

		creatorProfile = await client.query(GET_CREATOR_POSTS_WITHOUT_AUTH, {
			variables: {
				username: creatorUsername
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
	<title>Jamclout - Posts</title>
</svelte:head>

{#if creatorProps}
	{#if $creatorProps.loading}
		Loading {creatorUname}'s posts...
	{:else if $creatorProps.error}
		Error: {$creatorProps.error.message}
	{:else}
		<div class="grid grid-cols-3 gap-4 max-w-fit mx-auto pt-12">
			{#if $creatorProps.data && $creatorProps.data.creatorAccount}
				{#each $creatorProps.data.creatorAccount.posts.edges as post}
					<PostCard
						postData={post}
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

<style>
</style>
