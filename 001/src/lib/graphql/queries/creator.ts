import { gql } from '@apollo/client/core/index.js';

export const GET_CREATOR_POSTS_WITHOUT_AUTH = gql`
	query GetCreatorPostsWithOutAuth($username: String!) {
		creatorAccount(username: $username) {
			following
			username
			id
			image_next {
				id
				url
				blurhash
			}
			posts {
				edges {
					node {
						... on Post {
							id
							message
							embed
							thumbnail {
								id
								url
								blurhash
							}
							contents {
								id
								url
								mimetype
								blurhash
								thumbnail {
									id
									url
								}
							}
							likesCount
							comments {
								totalCount
							}
							visibilityType
							createdAt
						}
					}
				}
			}
		}
	}
`;

export const GET_CREATOR_POST_WITHOUT_AUTH = gql`
	query GetCreatorPostWithOutAuth($id: ID!) {
		node(id: $id) {
			... on Post {
				id
				creator {
					id
					username
					emailAddress
					username
					image_next {
						id
						url
						blurhash
					}
				}
				message
				likesCount
				createdAt
				embed
				thumbnail {
					id
					url
					blurhash
				}
				contents {
					id
					url
					mimetype
					thumbnail {
						id
						url
					}
				}
				comments {
					edges {
						node {
							... on Comment {
								account {
									... on CreatorAccount {
										id
										username
										image_next {
											id
											url
											blurhash
										}
									}
									... on FollowerAccount {
										id
										emailAddress
										username
									}
								}
								id
								createdAt
								message
							}
						}
					}
					totalCount
				}
			}
		}
	}
`;

export const PUBLIC_CREATOR_NFTS = gql`
	query PublicCreatorNfts($username: String!, $isAuthenticated: Boolean!) {
		creatorAccount(username: $username) {
			id
			username
			image_next {
				id
				url
				blurhash
			}
			nfts {
				totalCount
				edges {
					cursor
					node {
						id
						... on Nft {
							id
							message
							contents
							likesCount
							liked @include(if: $isAuthenticated)
							hidden
							createdAt
							availableCopiesCount
							copiesCount
							soldCopiesCount
							currentBidAmount
							originalUrl
							bids {
								totalCount
								edges {
									cursor
									node {
										__typename
										... on NftBid {
											id
											__typename
											bidder {
												... on Node {
													id
												}
												username
												image
											}
											amount
											createdAt
										}
									}
								}
							}
							copies {
								totalCount
								edges {
									node {
										__typename
										... on NftCopy {
											id
											__typename
											owner {
												... on Node {
													id
												}
												username
												image
											}
											amount
											createdAt
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;
