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

import { TokenList } from '../lib/types'

import mainnetJson from './../tokens/mainnet.json'
import testnetJson from './../tokens/testnet.json'
import devnetJson  from './devnet.json'

const mainnetTokenList = mainnetJson as TokenList
const testnetTokenList = testnetJson as TokenList
const devnetTokenList = devnetJson as TokenList

const tokenLists = [ mainnetTokenList, testnetTokenList, devnetTokenList ]

describe('TokenList', function () {
  it('should contains no duplicate', () => {
    tokenLists.forEach(checkDuplicates)
  })

  it('should have valid logoURI', () => {
    tokenLists.forEach((tokenList) => {
      tokenList.tokens.forEach((token) => {
        if(token.logoURI){
          expect(token.logoURI).toMatch(/https:\/\/raw\.githubusercontent\.com\/alephium\/tokens-meta\/master\/logos\/\w*(\.png|.svg)/)
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
})

function checkDuplicates(tokenList: TokenList): void {
  const addresses = new Map<string, boolean>()
  const names = new Map<string, boolean>()
  const symbols = new Map<string, boolean>()

  for (let token of tokenList.tokens) {
    //Address
    expect(addresses.get(token.address)).toEqual(undefined)
    addresses.set(token.address,true)

    //Name
    expect(names.get(token.name)).toEqual(undefined)
    names.set(token.name,true)

    //Symbol
    expect(symbols.get(token.symbol)).toEqual(undefined)
    symbols.set(token.symbol,true)
  }
}
