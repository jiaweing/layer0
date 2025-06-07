#!/usr/bin/env node

/**
 * Polar Integration Verification Script
 * 
 * This script helps verify that the Polar payments integration is properly configured.
 * Run with: node scripts/verify-polar.js
 */

const { Polar } = require('@polar-sh/sdk');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Polar Integration Setup...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  console.log('   Create .env.local by copying .env.example');
  process.exit(1);
}

// Load environment variables
require('dotenv').config({ path: envPath });

const requiredEnvVars = [
  'POLAR_ACCESS_TOKEN',
  'POLAR_GROUP_PRODUCT_ID',
  'POLAR_WEBHOOK_SECRET'
];

let hasAllEnvVars = true;

console.log('📋 Environment Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`   ✅ ${varName}: ${value.substring(0, 15)}...`);
  } else {
    console.log(`   ❌ ${varName}: Not set`);
    hasAllEnvVars = false;
  }
});

if (!hasAllEnvVars) {
  console.log('\n❌ Missing required environment variables');
  console.log('   Please update your .env.local file with Polar credentials');
  process.exit(1);
}

console.log('\n🔌 Testing Polar API Connection...');

async function verifyPolarSetup() {
  try {
    const polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
    });

    // Test API connection
    console.log('   Testing API connection...');
    
    // Try to fetch the specific product
    const productId = process.env.POLAR_GROUP_PRODUCT_ID;
    console.log(`   Checking product: ${productId}...`);
    
    const product = await polar.products.get({ id: productId });
    
    if (product) {
      console.log(`   ✅ Product found: "${product.name}" - $${product.priceAmount / 100}`);
      
      if (product.priceAmount === 2000) { // $20.00
        console.log('   ✅ Product price is correctly set to $20.00');
      } else {
        console.log(`   ⚠️  Product price is $${product.priceAmount / 100}, expected $20.00`);
      }
    }

    console.log('\n🎉 Polar integration verification completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start your development server: pnpm dev');
    console.log('   2. Navigate to /groups and test group creation');
    console.log('   3. Verify payment flow works end-to-end');

  } catch (error) {
    console.error('\n❌ Polar API Error:');
    console.error(`   ${error.message}`);
    
    if (error.message.includes('Unauthorized')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check your POLAR_ACCESS_TOKEN is correct');
      console.log('   - Ensure the token has required permissions');
    } else if (error.message.includes('Not Found')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check your POLAR_GROUP_PRODUCT_ID is correct');
      console.log('   - Ensure the product exists in your Polar dashboard');
    }
    
    process.exit(1);
  }
}

// Run verification
verifyPolarSetup().catch(console.error);
