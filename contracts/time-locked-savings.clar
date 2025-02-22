
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MIN_LOCK_PERIOD u10000) ;; Minimum blocks for lock period
(define-constant ERR_UNAUTHORIZED (err u1))
(define-constant ERR_INVALID_PERIOD (err u2))
(define-constant ERR_NO_SAVINGS (err u3))
(define-constant ERR_LOCK_ACTIVE (err u4))
(define-constant ERR_AMOUNT_TOO_LOW (err u5))

;; Data Maps
(define-map savings-vault
    { owner: principal }
    {
        amount: uint,
        lock-until: uint,
        emergency-contact: (optional principal)
    }
)

(define-map authorized-withdrawers
    { saver: principal, withdrawer: principal }
    { authorized: bool }
)

;; Public Functions

(define-public (create-savings-account (emergency-contact (optional principal)))
    (let
        ((sender tx-sender))
        (ok (map-set savings-vault
            { owner: sender }
            {
                amount: u0,
                lock-until: u0,
                emergency-contact: emergency-contact
            }
        ))
    )
)

(define-public (deposit (amount uint) (lock-period uint))
    (let
        ((sender tx-sender)
         (current-savings (get-savings-info sender)))
        (asserts! (>= lock-period MIN_LOCK_PERIOD) ERR_INVALID_PERIOD)
        (asserts! (> amount u0) ERR_AMOUNT_TOO_LOW)
        (asserts! (is-none current-savings) ERR_LOCK_ACTIVE)
        
        (try! (stx-transfer? amount sender (as-contract tx-sender)))
        
        (ok (map-set savings-vault
            { owner: sender }
            {
                amount: amount,
                lock-until: (+ block-height lock-period),
                emergency-contact: (get emergency-contact (unwrap-panic current-savings))
            }
        ))
    )
)
(define-public (withdraw)
    (let
        ((sender tx-sender)
         (savings (unwrap! (get-savings-info sender) ERR_NO_SAVINGS)))
        (asserts! (>= block-height (get lock-until savings)) ERR_LOCK_ACTIVE)
        
        (map-delete savings-vault { owner: sender })
        (as-contract (stx-transfer? (get amount savings) tx-sender sender))
    )
)

(define-public (authorize-emergency-withdrawer (withdrawer principal))
    (let
        ((sender tx-sender))
        (ok (map-set authorized-withdrawers
            { saver: sender, withdrawer: withdrawer }
            { authorized: true }
        ))
    )
)
(define-public (emergency-withdraw (saver principal))
    (let
        ((sender tx-sender)
         (savings (unwrap! (get-savings-info saver) ERR_NO_SAVINGS))
         (is-authorized (unwrap-panic (get-withdrawer-status saver sender))))
        (asserts! is-authorized ERR_UNAUTHORIZED)
        
        (map-delete savings-vault { owner: saver })
        (as-contract (stx-transfer? (get amount savings) tx-sender saver))
    )
)

;; Read-Only Functions

(define-read-only (get-savings-info (owner principal))
    (map-get? savings-vault { owner: owner })
)

(define-read-only (get-withdrawer-status (saver principal) (withdrawer principal))
    (default-to
        { authorized: false }
        (map-get? authorized-withdrawers { saver: saver, withdrawer: withdrawer })
    )
)
;; Error Handling and Security Checks
(define-private (check-lock-expired (savings {amount: uint, lock-until: uint, emergency-contact: (optional principal)}))
    (>= block-height (get lock-until savings))
)