<script lang="ts">
	import { assets } from '$app/paths';
	import { client } from '$lib/client';
	import Blurhash from '$lib/components/Blurhash.svelte';
	import { GET_CREATOR_POST_WITHOUT_AUTH } from '$lib/graphql/queries/creator';
	import { timeAgo } from '$lib/utils/dateTime';
	import { fade } from 'svelte/transition';

	let showModal = false;

	export let postData;
	export let creator;

	let creatorPost;
	function getOverlayText(type) {
		switch (type) {
			case 'FOLLOWERS_ONLY':
				return {
					displayText: `This post is for ${creator.username}’s followers only`,
					btnText: 'Follow to unlock'
				};
			case 'COIN_HOLDERS_ONLY':
				return {
					displayText: `This post is for ${creator.username}’s coin holders only`,
					btnText: 'Buy coin to unlock'
				};
			default:
				return {};
		}
	}

	let overlayProps = getOverlayText(postData.node.visibilityType);

	function toggleModal() {
		if (!overlayProps.displayText) {
			showModal = !showModal;
		}
	}

	async function getCreatorPost() {
		creatorPost = await client.query(GET_CREATOR_POST_WITHOUT_AUTH, {
			variables: {
				id: postData.node.id
			},
			fetchPolicy: 'no-cache'
		});
	}

	$: {
		if (showModal) {
			getCreatorPost();
		}
	}
</script>

<div
	on:click={toggleModal}
	class={`w-[250px] h-[332px] bg-[#A54ED5] justify-self-center rounded-lg bg-cover bg-center bg-no-repeat ${
		overlayProps.displayText ? '' : 'hover:cursor-pointer hover:brightness-75'
	}`}
	style={`background-image: url('${
		postData.node.thumbnail ? postData.node.thumbnail.url : `${assets}/blur.png`
	} ')`}
>
	{#if Boolean(overlayProps.displayText)}
		<div class="relative ">
			<div class="absolute">
				<Blurhash hash={'LEHV6nWB2yk8pyoJadR*.7kCMdnj'} width={250} height={332} />
			</div>
			<div class="absolute h-[332px] table text-center">
				<div class="table-cell align-middle text-white">
					<div class="mx-8 text-[18px] leading-[24px]">{overlayProps.displayText}</div>
					<button
						class="text-[16px] leading-[16px] mt-4 px-[24px] py-[16px] rounded-full border-solid border-[1px] opacity-80 hover:opacity-100"
						>{overlayProps.btnText}</button
					>
				</div>
			</div>
		</div>
	{:else}
		<div class="absolute text-white h-[332px] w-[250px] table">
			<div class="table-cell align-bottom">
				<div class="flex flex-row ml-4 mb-4">
					<div class="flex-none mr-2">
						<img src={`${assets}/icons/thumbs-up.svg`} alt="thumbs-up-icon" class="h-6" />
					</div>
					<div class="flex-none mr-4">{postData.node.likesCount}</div>
					<div class="flex-none mr-2">
						<img src={`${assets}/icons/message-circle.svg`} alt="message-circle-icon" class="h-6" />
					</div>
					<div class="flex-none">{postData.node.comments.totalCount}</div>
				</div>
			</div>
		</div>
	{/if}
</div>

{#if showModal}
	<div
		transition:fade
		class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none flex flex-row"
	>
		<div class="grow bg-[#191B1C]">
			<button
				class="h-[40px] w-[40px] rounded-full bg-[#1C121C] mt-[24px] ml-[24px] opacity-70 text-white active:bg-[#A54ED5] font-bold uppercase text-base shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
				type="button"
				on:click={toggleModal}
			>
				<img src={`${assets}/icons/x.svg`} alt="x-btn" class="h-[24px] mx-auto" />
			</button>
		</div>
		<div class="flex-none w-[398px] bg-white">
			<div class="flex flex-col">
				<div class="flex-none border-b-2">
					<div class="flex m-[24px]">
						<div class="flex-none mb-[2px]">
							<img
								src={creator.userDp}
								alt={creator.username}
								class="mx-auto w-[48px] h-[48px] rounded-full mr-4"
							/>
						</div>
						<div class="grow">
							<div class="flex flex-col">
								<div class="flex-none">
									<div class="flex justify-between">
										<div class="grow font-bold text-[#1C121C]">@{creator.username}</div>
										<div class="flex-none">{timeAgo(postData.node.createdAt)}</div>
									</div>
								</div>
								<div class="grow mb-[16px]">{postData.node.message || ''}</div>
								<div class="flex-none">
									<div class="flex flex-row">
										<div class="flex-none mr-2">
											<img src={`${assets}/icons/thumbs-up.svg`} alt="thumbs-up-icon" class="h-6" />
										</div>
										<div class="flex-none mr-4">{postData.node.likesCount}</div>
										<div class="flex-none mr-2">
											<img
												src={`${assets}/icons/message-circle.svg`}
												alt="message-circle-icon"
												class="h-6"
											/>
										</div>
										<div class="flex-none">{postData.node.comments.totalCount}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="grow mx-[24px] my-[16px]">
					<div class="flex flex-col">
						{#if creatorPost}
							{#if $creatorPost.loading}
								Loading comments...
							{:else if $creatorPost.error}
								Error: {$creatorPost.error.message}
							{:else if $creatorPost.data.node.comments.totalCount > 0}
								{#each $creatorPost.data.node.comments.edges as comment}
									<div class="flex flex-row mt-[8px]">
										<div class="flex-none">
											<img
												src={comment.node.account.image_next
													? comment.node.account.image_next.url
													: `${assets}/blur.png`}
												alt={comment.node.account.username}
												class="mx-auto w-[48px] h-[48px] rounded-full mr-4"
											/>
										</div>
										<div class="grow">
											<div class="flex flex-col">
												<div class="flex flex-row">
													<div class="flex-none mr-2 font-bold">
														@{comment.node.account.username}
													</div>
													<div class="grow">{comment.node.message}</div>
												</div>
												<div class="flex-none">
													{timeAgo($creatorPost.data.node.createdAt)}
												</div>
											</div>
										</div>
									</div>
								{/each}
							{/if}
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="opacity-80 fixed inset-0 z-40 bg-black" transition:fade />
{/if}
