import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: "Exonov Quantum API is running!",
    data: [
      { provider: 'IBM Quantum', up: true, credits: 8500 },
      { provider: 'AWS Braket', up: true, credits: 12000 },
      { provider: 'Azure Quantum', up: false, credits: 5500 },
      { provider: 'Google Quantum AI', up: true, credits: 15000 }
    ]
  });
}

export async function POST() {
  return NextResponse.json({ 
    success: true, 
    data: {
      allocations: { 'AAPL': 0.35, 'GOOGL': 0.30, 'MSFT': 0.25, 'AMZN': 0.10 },
      expected_return: 0.12,
      sharpe_ratio: 0.67
    }
  });
}
