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

export function checkDuplicates(tokensLike: { id: string; name: string; symbol: string }[]): void {
  const ids = new Map<string, boolean>()
  const names = new Map<string, boolean>()
  const symbols = new Map<string, boolean>()

  for (const token of tokensLike) {
    //Ids
    const idLower = token.id.toLowerCase()
    expect(ids.get(idLower)).toBeUndefined()
    ids.set(idLower, true)

    //Name
    const nameLower = token.name.toLowerCase()
    expect(names.get(nameLower)).toBeUndefined()
    names.set(nameLower, true)

    //Symbol
    const symbolLower = token.symbol.toLowerCase()
    expect(symbols.get(symbolLower)).toBeUndefined()
    symbols.set(symbolLower, true)
  }
}
