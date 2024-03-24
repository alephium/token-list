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

import mainnetTokenList from '../tokens/mainnet.json'
import testnetTokenList from '../tokens/testnet.json'
import { TokenInfo, TokenList } from './types'

export * from './types'

export const mainnet = mainnetTokenList as TokenList
export const testnet = testnetTokenList as TokenList

export const ALPH: TokenInfo = {
  id: ''.padStart(64, '0'),
  name: 'Alephium',
  symbol: 'ALPH',
  decimals: 18,
  logoURI: 'https://raw.githubusercontent.com/alephium/token-list/master/logos/alephium.png'
}

export function getTokensURL(networkId: 'mainnet' | 'testnet'): string {
  return `https://raw.githubusercontent.com/alephium/token-list/master/tokens/${networkId}.json`
}
