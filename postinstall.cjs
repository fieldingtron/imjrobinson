const crypto = require('node:crypto')
const fs = require('node:fs')
const readline = require('node:readline')

// Skip if running in production or CI environments where prompt isn't feasible
const isProduction =
  process.env.NODE_ENV?.toLowerCase() === 'production' ||
  process.env.VERCEL_ENV?.toLowerCase() === 'production' ||
  process.env.CONTEXT?.toLowerCase() === 'production'

const isCI = !!process.env.CI

if (isProduction || isCI) {
  console.log(
    'Production or CI environment detected. Skipping encryption/decryption.'
  )
  process.exit(0)
}

console.log('Not in production/CI environment. Proceeding with encryption/decryption checks.')

// Helper function to get password from env or prompt
async function getPassword(question) {
  if (process.env.PASSWORD) {
    console.log('Using password from PASSWORD environment variable.')
    return process.env.PASSWORD
  }

  // If stdin is not a TTY, we cannot prompt for a password
  if (!process.stdin.isTTY) {
    console.log('Non-interactive environment and PASSWORD environment variable not set. Skipping.')
    process.exit(0)
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  })

  return new Promise((resolve) => {
    rl.question(question, (password) => {
      rl.close()
      resolve(password)
    })
  })
}

// Function to encrypt the .env file
async function encryptFile(password) {
  const envContent = fs.readFileSync('.env', 'utf8')
  const iv = crypto.randomBytes(16)
  const key = crypto.scryptSync(password, 'salt', 32)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(envContent, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const encryptedContent = `${iv.toString('hex')}:${encrypted}`
  fs.writeFileSync('.env.enc', encryptedContent)
  console.log('.env file encrypted and saved to .env.enc')
}

// Function to decrypt the .env.enc file
async function decryptFile(password) {
  const encryptedContent = fs.readFileSync('.env.enc', 'utf8')
  const [ivHex, encryptedData] = encryptedContent.split(':')
  const key = crypto.scryptSync(password, 'salt', 32)
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    Buffer.from(ivHex, 'hex')
  )

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  fs.writeFileSync('.env', decrypted)
  console.log('.env file restored from .env.enc')
}

// Main logic to check file existence and perform encryption/decryption
;(async () => {
  const envExists = fs.existsSync('.env')
  const envEncExists = fs.existsSync('.env.enc')

  if (envExists && !envEncExists) {
    console.log('.env exists but .env.enc does not. Encrypting .env...')
    const password = await getPassword('Enter password to encrypt .env: ')
    await encryptFile(password)
  } else if (envEncExists && !envExists) {
    console.log('.env.enc exists but .env does not. Decrypting .env.enc...')
    const password = await getPassword('Enter password to decrypt .env.enc: ')
    try {
      await decryptFile(password)
    } catch (error) {
      console.error(
        'Decryption failed. Please check the password and try again.'
      )
    }
  } else {
    console.log(
      'No action needed. Either both or neither .env/.env.enc files exist.'
    )
  }
})()
