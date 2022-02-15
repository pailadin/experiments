<script lang="ts">
	import { assets } from '$app/paths';

	export let nftData;
</script>

<div
	class={`w-[250px] h-[332px] bg-[#A54ED5] justify-self-center rounded-lg bg-cover bg-center bg-no-repeat`}
	style={`background-image: url('${
		nftData.node.contents ? nftData.node.contents[0] : `${assets}/blur.png`
	} ')`}
>
	<div class="absolute h-[332px] w-[250px] table ">
		<div class="table-cell align-bottom">
			<div class="flex justify-between bg-white py-[8px] px-[18px] shadow shadow-lg rounded-b-lg">
				<div class="flex-none">
					<div class="flex flex-col">
						<div class="flex-none uppercase text-[10px] leading-[20px] text-[gray]">Available</div>
						<div class="flex-none text-[16px] leading-[24px] font-semibold">
							{nftData.node.availableCopiesCount} of {nftData.node.soldCopiesCount}
						</div>
					</div>
				</div>
				<div class="flex-none">
					<div class="flex flex-col">
						<div class="flex-none uppercase text-[10px] leading-[20px] text-[gray]">
							Current Bid
						</div>
						<div class="flex-none text-[16px] leading-[24px] font-semibold">
							~${nftData.node.currentBidAmount.toFixed(2)}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
