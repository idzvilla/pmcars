// scripts/convert-csv.js
// Run with: node scripts/convert-csv.js
const fs = require('fs')
const path = require('path')

const csvPath = path.join(__dirname, '../references/extension/dist/config/us-domestic-prices.csv')
const outPath = path.join(__dirname, '../src/data/us-domestic-prices.json')

const content = fs.readFileSync(csvPath, 'utf-8')
const lines = content.split('\n').filter(line => line.trim())

// Skip 2 header rows, then parse data
const entries = lines.slice(2).map(line => {
  const cols = line.split(',')
  const location = cols[1]?.trim()
  const auction = cols[2]?.trim().toLowerCase()
  const port = cols[3]?.trim()
  const regular = parseInt(cols[4]) || 0
  const large = parseInt(cols[5]) || 0
  const oversize = parseInt(cols[6]) || 0
  if (!location || !auction || !port) return null
  return { location, auction, port, regular, large, oversize }
}).filter(Boolean)

fs.writeFileSync(outPath, JSON.stringify(entries, null, 2))
console.log(`Converted ${entries.length} entries to ${outPath}`)
