// ── UPI SMS Parser ────────────────────────────────────────────────────────────
// Parses real Indian bank SMS formats into structured transaction data

const SMS_PATTERNS = [
  // HDFC: "Rs.500.00 debited from A/C XX1234 to merchant@upi on 04-04-25"
  {
    regex: /Rs\.?([\d,]+\.?\d*)\s+debited.*?(?:to\s+([a-z0-9._-]+@[a-z]+))?\s+on\s+([\d-]+)/i,
    type: 'expense',
    amountIdx: 1, upiIdx: 2, dateIdx: 3,
  },
  // SBI: "Your A/C XXXX1234 is debited with INR 1,500.00 on 04-Apr-25 to MERCHANT@UPI"
  {
    regex: /debited with (?:INR|Rs\.?)\s*([\d,]+\.?\d*).*?on\s+([\d\-A-Za-z]+).*?to\s+([a-z0-9._-]+@[a-z]+)/i,
    type: 'expense',
    amountIdx: 1, dateIdx: 2, upiIdx: 3,
  },
  // ICICI: "ICICI Bank: Rs 200 debited for UPI txn. VPA zomato@icici on 04-04-2025"
  {
    regex: /Rs\.?\s*([\d,]+\.?\d*)\s+debited.*?VPA\s+([a-z0-9._-]+@[a-z]+)\s+on\s+([\d-]+)/i,
    type: 'expense',
    amountIdx: 1, upiIdx: 2, dateIdx: 3,
  },
  // Axis: "INR 3,200.00 credited to your A/C XXXX from rohan@ybl on 04-04-2025"
  {
    regex: /INR\s*([\d,]+\.?\d*)\s+credited.*?from\s+([a-z0-9._-]+@[a-z]+).*?on\s+([\d-]+)/i,
    type: 'income',
    amountIdx: 1, upiIdx: 2, dateIdx: 3,
  },
  // Generic credited
  {
    regex: /(?:INR|Rs\.?)\s*([\d,]+\.?\d*)\s+credited.*?([a-z0-9._-]+@[a-z]+)/i,
    type: 'income',
    amountIdx: 1, upiIdx: 2, dateIdx: null,
  },
  // Generic debited
  {
    regex: /(?:INR|Rs\.?)\s*([\d,]+\.?\d*)\s+debited.*?([a-z0-9._-]+@[a-z]+)/i,
    type: 'expense',
    amountIdx: 1, upiIdx: 2, dateIdx: null,
  },
]

// Known UPI handles → merchant names + categories
const UPI_MERCHANT_MAP = {
  'zomato':       { name: 'Zomato',           category: 'Food & Dining'   },
  'swiggy':       { name: 'Swiggy',           category: 'Food & Dining'   },
  'dominos':      { name: "Domino's Pizza",   category: 'Food & Dining'   },
  'mcdonalds':    { name: "McDonald's",       category: 'Food & Dining'   },
  'uber':         { name: 'Uber',             category: 'Transportation'  },
  'ola':          { name: 'Ola Cabs',         category: 'Transportation'  },
  'rapido':       { name: 'Rapido',           category: 'Transportation'  },
  'irctc':        { name: 'IRCTC Tickets',    category: 'Transportation'  },
  'netflix':      { name: 'Netflix',          category: 'Entertainment'   },
  'spotify':      { name: 'Spotify',          category: 'Entertainment'   },
  'bookmyshow':   { name: 'BookMyShow',       category: 'Entertainment'   },
  'amazon':       { name: 'Amazon',           category: 'Shopping'        },
  'flipkart':     { name: 'Flipkart',         category: 'Shopping'        },
  'myntra':       { name: 'Myntra',           category: 'Shopping'        },
  'meesho':       { name: 'Meesho',           category: 'Shopping'        },
  'apollo':       { name: 'Apollo Pharmacy',  category: 'Healthcare'      },
  'netmeds':      { name: 'Netmeds',          category: 'Healthcare'      },
  '1mg':          { name: '1mg Pharmacy',     category: 'Healthcare'      },
  'practo':       { name: 'Practo',           category: 'Healthcare'      },
  'byju':         { name: "Byju's",           category: 'Education'       },
  'udemy':        { name: 'Udemy',            category: 'Education'       },
  'unacademy':    { name: 'Unacademy',        category: 'Education'       },
  'bses':         { name: 'BSES Electricity', category: 'Utilities'       },
  'tata':         { name: 'Tata Power',       category: 'Utilities'       },
  'airtel':       { name: 'Airtel Recharge',  category: 'Utilities'       },
  'jio':          { name: 'Jio Recharge',     category: 'Utilities'       },
  'zerodha':      { name: 'Zerodha',          category: 'Investment'      },
  'groww':        { name: 'Groww',            category: 'Investment'      },
  'paytmmoney':   { name: 'Paytm Money',      category: 'Investment'      },
}

function resolveUpiMerchant(upiHandle) {
  if (!upiHandle) return { name: 'UPI Payment', category: 'Other' }
  const lower = upiHandle.toLowerCase()
  for (const [key, val] of Object.entries(UPI_MERCHANT_MAP)) {
    if (lower.includes(key)) return val
  }
  // Fall back to UPI handle prefix as name
  const prefix = upiHandle.split('@')[0].replace(/[._-]/g, ' ')
  const name = prefix.charAt(0).toUpperCase() + prefix.slice(1)
  return { name: `${name} (UPI)`, category: 'Other' }
}

function parseAmount(str) {
  if (!str) return 0
  return parseFloat(str.replace(/,/g, '')) || 0
}

function parseDate(str) {
  if (!str) return new Date().toISOString().slice(0, 10)
  // dd-mm-yy or dd-mm-yyyy
  const m1 = str.match(/(\d{2})[/-](\d{2})[/-](\d{2,4})/)
  if (m1) {
    let [, d, mo, y] = m1
    if (y.length === 2) y = '20' + y
    return `${y}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}`
  }
  // dd-Mon-yy
  const months = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12 }
  const m2 = str.match(/(\d{1,2})[/-]([A-Za-z]{3})[/-](\d{2,4})/i)
  if (m2) {
    let [, d, mo, y] = m2
    const mon = months[mo.toLowerCase()] || 1
    if (y.length === 2) y = '20' + y
    return `${y}-${String(mon).padStart(2,'0')}-${d.padStart(2,'0')}`
  }
  return new Date().toISOString().slice(0, 10)
}

export function parseUpiSms(smsText) {
  const text = smsText.trim()

  for (const pattern of SMS_PATTERNS) {
    const match = text.match(pattern.regex)
    if (!match) continue

    const amount   = parseAmount(match[pattern.amountIdx])
    const upiId    = pattern.upiIdx    ? match[pattern.upiIdx]    : null
    const dateStr  = pattern.dateIdx   ? match[pattern.dateIdx]   : null

    if (!amount) continue

    const { name, category } = resolveUpiMerchant(upiId)

    return {
      success: true,
      amount,
      type: pattern.type,
      description: name,
      category,
      date: parseDate(dateStr),
      upiId: upiId || null,
      rawSms: smsText,
    }
  }

  return { success: false, rawSms: smsText }
}

// Sample SMS strings for demo
export const SAMPLE_SMS = [
  'Rs.650.00 debited from A/C XX4321 to zomato@icici on 04-04-25. UPI Ref: 512345678',
  'Your A/C XXXX1234 is debited with INR 1,200.00 on 04-Apr-25 to uber@paytm. UPI:TXN9876',
  'INR 3,200.00 credited to your A/C XXXX from rohan@ybl on 04-04-2025. UPI Ref:TXN1234',
  'ICICI Bank: Rs 449 debited for UPI txn. VPA udemy@icici on 04-04-2025. Ref 9988776655',
  'Rs.2,400.00 debited from A/C XX9988 to bses@upi on 04-04-25. UPI Ref: 445566778',
  'Rs.119.00 debited from A/C XX5678 to spotify@icici on 04-04-25. UPI Ref: 334455667',
]
