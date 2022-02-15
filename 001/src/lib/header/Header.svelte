<script lang="ts">
	// import { page } from '$app/stores';
	export let getProfileRes;
	import { assets } from '$app/paths';
</script>

<header
	class="bg-cover bg-[#A54ED5] bg-center bg-no-repeat h-64"
	style={`background-image: url('${
		getProfileRes &&
		getProfileRes.data &&
		getProfileRes.data.creatorAccount &&
		getProfileRes.data.creatorAccount.coverImage
			? getProfileRes.data.creatorAccount.coverImage.url
			: `${assets}/cover-photo.jpg`
	} ')`}
>
	<div class="h-16 flex justify-between py-3 px-7">
		<img src={`${assets}/logo-light.png`} alt="Jamclout Logo" class="h-full w-min object-cover" />
		<img
			src={`${assets}/avatar-sample.png`}
			alt="Jamclout Logo"
			class="h-full w-min object-cover"
		/>
	</div>
</header>

<style>
</style>
