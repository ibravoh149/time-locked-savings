
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