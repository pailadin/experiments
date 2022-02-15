<script lang="ts" context="module">
	import { assets } from '$app/paths';
	import FanTabs from '$lib/components/FanTabs.svelte';
	import SupportButton from '$lib/components/SupportButton.svelte';
	import Header from '$lib/header/Header.svelte';
	import type { Load } from '@sveltejs/kit';
	import '../../app.css';

	let creatorProfile;

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ params }) => {
		const creatorUsername = params.username;

		// creatorProfile = await client.query(GET_PROFILE, {
		// 	variables: {
		// 		username: creatorUsername
		// 	},
		// 	fetchPolicy: 'no-cache'
		// });

		const endpoint = 'https://beta-api.jamclout.com/graphql';
		const headers = {
			'content-type': 'application/json'
			// "Authorization": "<token>"
		};
		const graphqlQuery = {
			operationName: 'GetProfile',
			query: `query GetProfile($username: String!) {
								creatorAccount(username: $username) {
									... on CreatorAccount {
										id
										role
										username
										description
										following
										followersCount
										followingCount
										image_next {
											id
											url
											blurhash
										}
										coverImage {
											id
											url
										}
										integrations {
											id
											type
											followersCount
											followingCount
											url
											createdAt
											externalAccount {
												username
												image
												description
												createdAt
												updatedAt
												account {
													emailAddress
													role
													createdAt
													updatedAt
												}
												... on BitcloutExternalAccount {
													id
													publicKey
													coinPrice
												}
											}
										}
										links {
											id
											link
										}
										topTippers {
											id
											externalAccount {
												... on Node {
													id
												}
												image
												username
											}
											tipsSent
										}
										topInvestors {
											id
											externalAccount {
												... on Node {
													id
												}
												image
												username
											}
											holdings
										}
									}
								}
							}`,
			variables: {
				username: creatorUsername
			}
		};

		const options = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(graphqlQuery)
		};

		const response = await fetch(endpoint, options);
		creatorProfile = await response.json();
		console.log(
			'🚀 ~ file: __layout.reset.svelte ~ line 116 ~ constload:Load= ~ creatorProfile',
			creatorProfile
		);

		if (response.ok) {
			return {
				props: { getProfileRes: creatorProfile }
			};
		}

		return {
			status: response.status,
			error: new Error('Could not fetch the profile')
		};
	};
</script>

<script lang="ts">
	export let getProfileRes;
</script>

<Header {getProfileRes} />

<main class="container mx-auto h-full">
	<div class="flex">
		<div class="flex-none w-1/5 relative">
			{#if getProfileRes}
				{#if getProfileRes.data.creatorAccount}
					<div class="absolute -top-20 h-auto inset-x-0 text-center">
						<img
							src={getProfileRes.data.creatorAccount.image_next.url}
							alt={getProfileRes.data.creatorAccount.username}
							class="mx-auto w-44 h-44 rounded-full outline outline-4 outline-offset-0 outline-white bg-white"
						/>
						<p class="font-bold text-2xl my-2">@{getProfileRes.data.creatorAccount.username}</p>
						<div class="flex flex-row items-center justify-center">
							<div class="flex flex-col mx-2">
								<p class="flex-none font-bold text-xl">
									{getProfileRes.data.creatorAccount.followersCount}
								</p>
								<p class="flex-none text-sm text-[#A5A5A5]">Followers</p>
							</div>
							<div class="flex flex-col mx-2">
								<p class="flex-none font-bold text-xl">
									{getProfileRes.data.creatorAccount.followingCount}
								</p>
								<p class="flex-none text-sm text-[#A5A5A5]">Following</p>
							</div>
						</div>
						<SupportButton creatorData={getProfileRes.data.creatorAccount} />
						<div class="text-left mb-7">
							<p class="flex-none font-bold text-xl mb-4">About</p>
							<p class="flex-none text-sm">
								{getProfileRes.data.creatorAccount.description}
							</p>
						</div>
						<div class="text-left mb-7">
							<p class="flex-none font-bold text-xl mb-4">Links</p>
							{#if getProfileRes.data.creatorAccount.integrations.find((integration) => integration.type === 'BITCLOUT')}
								<div class="flex justify-between">
									<div class="flex-none w-8 h-8 mr-2">
										<img
											src={`${assets}/icons/bitclout-logo.svg`}
											alt="bitclout-icon"
											color="black"
											class="mx-auto"
										/>
									</div>
									<div class="flex-none mr-2"><p class="text-base">Bitclout</p></div>
									<div class="grow text-base text-[#70747D]">
										{getProfileRes.data.creatorAccount.integrations.find(
											(integration) => integration.type === 'BITCLOUT'
										).followersCount} followers
									</div>
									<div class="flex-none w-12 h-8">
										<img
											src={`${assets}/icons/check-circle.svg`}
											alt="check-circle"
											class="mx-auto"
										/>
									</div>
								</div>
							{/if}

							{#if getProfileRes.data.creatorAccount.integrations.find((integration) => integration.type === 'TWITTER')}
								<div class="flex justify-between">
									<div class="flex-none w-8 h-8 mr-2">
										<img src={`${assets}/icons/twitter.svg`} alt="twitter-icon" class="h-6" />
									</div>
									<div class="flex-none mr-2"><p class="text-base">Twitter</p></div>
									<div class="grow text-base text-[#70747D]">
										{getProfileRes.data.creatorAccount.integrations.find(
											(integration) => integration.type === 'TWITTER'
										).followersCount} followers
									</div>
									<div class="flex-none w-12 h-8">
										<img
											src={`${assets}/icons/check-circle.svg`}
											alt="check-circle"
											class="mx-auto"
										/>
									</div>
								</div>
							{/if}

							{#if getProfileRes.data.creatorAccount.links.length > 0}
								{#each getProfileRes.data.creatorAccount.links as linkItem}
									<div class="flex justify-between">
										<div class="flex-none w-8 h-8 mr-2">
											<img
												src={`${assets}/icons/link.svg`}
												alt="link-icon"
												class="h-[21px] mx-auto"
											/>
										</div>
										<div class="grow">
											<a href={linkItem.link} target="_blank" class="text-base text-[#1C121C]"
												>{linkItem.link}</a
											>
										</div>
									</div>
								{/each}
							{/if}
						</div>
						<div class="text-left">
							<p class="flex-none font-bold text-xl">Fans</p>
							{#if getProfileRes.data && getProfileRes.data.creatorAccount}
								<FanTabs topInvestors={getProfileRes.data.creatorAccount.topInvestors} />
							{/if}
						</div>
					</div>
				{/if}
			{/if}
		</div>
		<div class="grow">
			<slot />
		</div>
	</div>
</main>
