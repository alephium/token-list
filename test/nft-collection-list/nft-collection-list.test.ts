/*
Copyright 2018 - 2023 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { NodeProvider } from '@alephium/web3'

import { NFTCollectionList } from '../../lib/types'
import mainnetJson from '../../nft-collections/mainnet.json'
import testnetJson from '../../nft-collections/testnet.json'
import devnetJson from './devnet.json'

const mainnetNFTCollectionList = mainnetJson as NFTCollectionList
const testnetNFTCollectionList = testnetJson as NFTCollectionList
const devnetNFTCollectionList = devnetJson as NFTCollectionList

const nftCollectionLists = [mainnetNFTCollectionList, testnetNFTCollectionList, devnetNFTCollectionList]

const mainnetURL = process.env.MAINNET_URL as string
const testnetURL = process.env.TESTNET_URL as string

describe('NFTCollectionList', function () {
  it('should contains no duplicate', () => {
    nftCollectionLists.forEach((nftCollectionList) => {
      const collectionIds = nftCollectionList.nftCollections.map((nftCollection) => nftCollection.id)
      expect(collectionIds.length).toEqual(new Set(collectionIds).size)
    })
  })

  it('should have valid networkId', () => {
    nftCollectionLists.forEach((nftCollectionList) => {
      expect(nftCollectionList.networkId).toBeGreaterThanOrEqual(0)
    })
  })

  it('should have a networkId matching file name', () => {
    expect(mainnetJson.networkId).toEqual(0)
    expect(testnetJson.networkId).toEqual(1)
  })

  it('validate nft types', () => {
    return Promise.all([
      validateNftType(mainnetNFTCollectionList, mainnetURL),
      validateNftType(testnetNFTCollectionList, testnetURL)
    ])
  })

  it('validate nft metadata', () => {
    return Promise.all([
      validateNftMetadata(mainnetNFTCollectionList, mainnetURL),
      validateNftMetadata(testnetNFTCollectionList, testnetURL)
    ])
  })

  async function validateNftType(nftList: NFTCollectionList, url: string) {
    const nodeProvider = new NodeProvider(url)

    return Promise.all(
      nftList.nftCollections.map((collection) =>
        nodeProvider.guessFollowsNFTCollectionStd(collection.id).then((bool) => expect(bool).toEqual(true))
      )
    )
  }

  async function validateNftMetadata(nftList: NFTCollectionList, url: string) {
    const nodeProvider = new NodeProvider(url)

    return Promise.all(
      nftList.nftCollections.map((collection) =>
        nodeProvider
          .fetchNFTCollectionMetaData(collection.id)
          .then((metadata) => expect(metadata.collectionUri).toMatch(/^https:\/\//))
      )
    )
  }
})
