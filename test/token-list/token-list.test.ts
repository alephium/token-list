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

import { FungibleTokenMetaData, hexToString, NodeProvider } from '@alephium/web3'

import { TokenInfo, TokenList } from '../../lib/types'
import mainnetJson from '../../tokens/mainnet.json'
import testnetJson from '../../tokens/testnet.json'
import { checkDuplicates } from '../utils'
import devnetJson from './devnet.json'

const mainnetTokenList = mainnetJson as TokenList
const testnetTokenList = testnetJson as TokenList
const devnetTokenList = devnetJson as TokenList

const tokenLists = [mainnetTokenList, testnetTokenList, devnetTokenList]

const mainnetURL = 'https://wallet-v20.mainnet.alephium.org'
const testnetURL = 'https://wallet-v20.testnet.alephium.org'

describe('TokenList', function () {
  it('should contains no duplicate', () => {
    tokenLists.forEach((tokenList) => checkDuplicates(tokenList.tokens))
  })

  it('should have valid logoURI', () => {
    tokenLists.forEach((tokenList) => {
      tokenList.tokens.forEach((token) => {
        if (token.logoURI) {
          expect(token.logoURI).toMatch(
            new RegExp(`https://raw.githubusercontent.com/alephium/token-list/master/logos/${token.symbol}.(png|svg)`)
          )
        }
      })
    })
  })

  it('should have valid decimals', () => {
    tokenLists.forEach((tokenList) => {
      tokenList.tokens.forEach((token) => {
        //TODO check what are valid decimals, at least positive number for now
        expect(token.decimals).toBeGreaterThanOrEqual(0)
      })
    })
  })

  it('should have valid networkId', () => {
    tokenLists.forEach((tokenList) => {
      expect(tokenList.networkId).toBeGreaterThanOrEqual(0)
    })
  })

  it('should have a networkId matching file name', () => {
    expect(mainnetJson.networkId).toEqual(0)
    expect(testnetJson.networkId).toEqual(1)
  })

  it('validate token types', async () => {
    await validateTokenType(mainnetTokenList, mainnetURL)
    await validateTokenType(testnetTokenList, testnetURL)
  })

  it('validate token metadata', async () => {
    await validateTokenMetadata(mainnetTokenList, mainnetURL)
    await validateTokenMetadata(testnetTokenList, testnetURL)
  }, 10000)

  async function validateTokenType(tokenList: TokenList, url: string) {
    const nodeProvider = new NodeProvider(url)

    return Promise.all(
      tokenList.tokens.map((token) =>
        nodeProvider.guessStdTokenType(token.id).then((tokenType) => expect(tokenType).toEqual('fungible'))
      )
    )
  }

  async function validateTokenMetadata(tokenList: TokenList, url: string) {
    const nodeProvider = new NodeProvider(url)

    return Promise.all(
      tokenList.tokens.map((token) =>
        nodeProvider.fetchFungibleTokenMetaData(token.id).then((metadata) => checkMetadata(metadata, token))
      )
    )
  }

  function checkMetadata(metadata: FungibleTokenMetaData, token: TokenInfo) {
    expect(hexToString(metadata.name)).toEqual(token.name)
    expect(hexToString(metadata.symbol)).toEqual(token.symbol)
    expect(metadata.decimals).toEqual(token.decimals)
  }
})
