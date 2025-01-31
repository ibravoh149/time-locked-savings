
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that <...>",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let block = chain.mineBlock([
            /* 
             * Add transactions with: 
             * Tx.contractCall(...)
            */
        ]);
        assertEquals(block.receipts.length, 0);
        assertEquals(block.height, 2);

        block = chain.mineBlock([
            /* 
             * Add transactions with: 
             * Tx.contractCall(...)
            */
        ]);
        assertEquals(block.receipts.length, 0);
        assertEquals(block.height, 3);
    },
});

Clarinet.test({
    name: "Ensure that users can deposit STX",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
            // First create an account
            Tx.contractCall(
                "time-locked-savings",
                "create-savings-account",
                [types.none()],
                wallet1.address
            ),
            // Then deposit STX
            Tx.contractCall(
                "time-locked-savings",
                "deposit",
                [types.uint(1000000), types.uint(10000)], // 1 STX, 10000 blocks
                wallet1.address
            ),
        ]);
        
        assertEquals(block.receipts.length, 2);
        assertEquals(block.receipts[1].result, '(ok true)');
    },
});
Clarinet.test({
    name: "Ensure that withdrawals are locked during time-lock period",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
            // Create account and deposit
            Tx.contractCall(
                "time-locked-savings",
                "create-savings-account",
                [types.none()],
                wallet1.address
            ),
            Tx.contractCall(
                "time-locked-savings",
                "deposit",
                [types.uint(1000000), types.uint(10000)],
                wallet1.address
            ),
        ]);

        // Try to withdraw immediately (should fail)
        let withdrawBlock = chain.mineBlock([
            Tx.contractCall(
                "time-locked-savings",
                "withdraw",
                [],
                wallet1.address
            ),
        ]);

        assertEquals(withdrawBlock.receipts[0].result, '(err u4)'); // ERR_LOCK_ACTIVE
    },
});

Clarinet.test({
    name: "Ensure emergency withdrawal works correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;

        let block = chain.mineBlock([
            // Create account with emergency contact
            Tx.contractCall(
                "time-locked-savings",
                "create-savings-account",
                [types.some(wallet2.address)],
                wallet1.address
            ),
            // Deposit STX
            Tx.contractCall(
                "time-locked-savings",
                "deposit",
                [types.uint(1000000), types.uint(10000)],
                wallet1.address
            ),
            // Authorize emergency withdrawer
            Tx.contractCall(
                "time-locked-savings",
                "authorize-emergency-withdrawer",
                [types.principal(wallet2.address)],
                wallet1.address
            ),
        ]);

        // Emergency withdraw
        let emergencyBlock = chain.mineBlock([
            Tx.contractCall(
                "time-locked-savings",
                "emergency-withdraw",
                [types.principal(wallet1.address)],
                wallet2.address
            ),
        ]);

        assertEquals(emergencyBlock.receipts[0].result, '(ok true)');
    },
});