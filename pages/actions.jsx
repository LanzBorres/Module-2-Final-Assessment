import React, { useState } from "react";


export default function Actions({ withdraw, deposit }) {

    const [amount, setAmount] = useState(0)
    const [loading, setLoading] = useState(false)

    const onWithdraw = () => {
        if(amount <= 0) {
            alert("Input must be greater than zero!")
        }
        setLoading(true)
        withdraw(amount)
            .then(() => {
                console.log("Success")
            }).finally(() => {
                setLoading(false)
            })
    }

    const onDeposit = () => {
        if(amount <= 0) {
            alert("Input must be greater than zero!")
        }
        setLoading(true)
        deposit(amount)
            .then(() => {
                console.log("Success")
            }).finally(() => {
                setLoading(false)
            })
    }
    return (
        <>
            <div>
                {
                    loading ? (
                        <>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-full bg-neutral-500 animate-pulse" />
                                <div className="w-10 h-10 rounded-full bg-neutral-500 animate-pulse" />
                                <div className="w-10 h-10 rounded-full bg-neutral-500 animate-pulse" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-center">
                                <input className="px-4 py-2 border rounded-lg" type="number" value={amount} onChange={(e) => {
                                    setAmount(e.target.value)
                                }} />
                            </div>
                            <div className="mt-5">
                                <button disabled={amount <= 0} className="bg-red-400 outline-none hover:bg-red-700 text-white rounded p-1 px-3  shadow p-2 disabled:cursor-not-allowed disabled:bg-neutral-400/75" onClick={onDeposit}>Deposit</button>
                                <button disabled={amount <= 0} className="bg-red-400 ml-20  outline-none hover:bg-red-700 text-white rounded p-1 px-3 shadow p-2 disabled:cursor-not-allowed disabled:bg-neutral-400/75" onClick={onWithdraw}>Withdraw</button>
                            </div>
                        </>
                    )
                }
            </div>
        </>
    )
}