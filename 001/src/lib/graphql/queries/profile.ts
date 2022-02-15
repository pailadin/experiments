import { gql } from '@apollo/client/core/index.js';

export const GET_PROFILE = gql`
	query GetProfile($username: String!) {
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
	}
`;
