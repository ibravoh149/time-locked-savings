
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