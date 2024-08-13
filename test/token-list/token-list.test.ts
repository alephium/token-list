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

interface TokenListJson extends TokenList {
  networkId: number
  tokens: TokenInfoJson[]
}

interface TokenInfoJson extends TokenInfo {
  nameOnChain?: string
  symbolOnChain?: string
}

const mainnetTokenList = mainnetJson as TokenListJson
const testnetTokenList = testnetJson as TokenListJson
const devnetTokenList = devnetJson as TokenListJson

const tokenLists = [mainnetTokenList, testnetTokenList, devnetTokenList]

const mainnetURL = 'https://node.mainnet.alephium.org'
const testnetURL = 'https://node.testnet.alephium.org'

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

  it('should not contain extra fields', () => {
    const allowedFields = ['id', 'name', 'nameOnChain', 'symbol', 'symbolOnChain', 'decimals', 'description', 'logoURI']
    tokenLists.forEach((tokenList) => {
      tokenList.tokens.forEach((token) => {
        const tokenFields = Object.keys(token)
        tokenFields.forEach((field) => expect(allowedFields).toContain(field))
      })
    })
  })

  const mainnetNodeProvider = new NodeProvider(mainnetURL)
  mainnetTokenList.tokens.forEach((token) => {
    if (token.symbol !== 'ALPH') {
      it(`validate mainnet ${token.name}`, async () => {
        await validateTokenMetadata(token, mainnetNodeProvider)
        await validateTokenType(token, mainnetNodeProvider)
      })
    }
  })

  it('should have ALPH token', () => {
    const expectedALPH: TokenInfo = {
      id: ''.padStart(64, '0'),
      name: 'Alephium',
      symbol: 'ALPH',
      decimals: 18,
      description:
        'Alephium is a scalable, decentralized, and secure blockchain platform that enables the creation of fast and secure applications.',
      logoURI: 'https://raw.githubusercontent.com/alephium/token-list/master/logos/ALPH.png'
    }

    tokenLists.forEach((tokenList) => {
      expect(tokenList.tokens.find((token) => token.symbol === 'ALPH')).toEqual(expectedALPH)
    })
  })

  const testnetNodeProvider = new NodeProvider(testnetURL)
  testnetTokenList.tokens.forEach((token) => {
    if (token.symbol !== 'ALPH') {
      it(`validate testnet ${token.name}`, async () => {
        await validateTokenMetadata(token, testnetNodeProvider)
        await validateTokenType(token, testnetNodeProvider)
      })
    }
  })

  async function validateTokenType(token: TokenInfo, nodeProvider: NodeProvider) {
    await nodeProvider.guessStdTokenType(token.id).then((tokenType) => expect(tokenType).toEqual('fungible'))
  }

  async function validateTokenMetadata(token: TokenInfo, nodeProvider: NodeProvider) {
    await nodeProvider.fetchFungibleTokenMetaData(token.id).then((metadata) => checkMetadata(metadata, token))
  }

  const tokensWithSymbolVariant = ['ALF', 'ANS']

  function checkMetadata(metadata: FungibleTokenMetaData, token: TokenInfoJson) {
    expect(hexToString(metadata.name)).toEqual(token.nameOnChain ?? token.name)
    expect(hexToString(metadata.symbol)).toEqual(token.symbolOnChain ?? token.symbol)
    expect(metadata.decimals).toEqual(token.decimals)

    if (token.symbolOnChain !== undefined) {
      expect(tokensWithSymbolVariant.includes(token.symbolOnChain)).toBe(true)
    }
  }
})
