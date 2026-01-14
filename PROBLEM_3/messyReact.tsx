interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string; // Added the blockchain property that was missing from the interface but used throughout the code
}

interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
    blockchain: string;
    priority: number;
}

// Instead of using 'any' type, we now have a proper union type for better type safety
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    // This function now has proper typing instead of accepting 'any' type
    // We also optimized it so it's only called once per balance instead of multiple times
    const getPriority = (blockchain: Blockchain | string): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100;
            case 'Ethereum':
                return 50;
            case 'Arbitrum':
                return 30;
            case 'Zilliqa':
                return 20;
            case 'Neo':
                return 20;
            default:
                return -99;
        }
    };

    // Fixed several issues here:
    // - The original code had an undefined variable 'lhsPriority' that should have been 'balancePriority'
    // - The filter logic was backwards - it was keeping invalid balances and filtering out valid ones
    // - The sort function was missing a return value when priorities were equal
    // - We removed 'prices' from dependencies since it's not actually used in this computation
    // - Simplified the sort comparison to use subtraction instead of multiple if-else statements
    // - Now we calculate the priority once per balance instead of calling getPriority multiple times
    const sortedBalances = useMemo(() => {
        // First, we calculate the priority for each balance and attach it to the balance object
        const balancesWithPriority = balances
            .map((balance: WalletBalance) => ({
                ...balance,
                priority: getPriority(balance.blockchain) // Calculate once and store it
            }))
            .filter((balance) => {
                // Fixed the logic - now we keep balances that have a valid priority and positive amount
                // The original code was doing the opposite!
                return balance.priority > -99 && balance.amount > 0;
            });

        // Sort by priority in descending order (highest first)
        // Using simple subtraction is cleaner and automatically handles the equal case (returns 0)
        return balancesWithPriority.sort((lhs, rhs) => {
            return rhs.priority - lhs.priority;
        });
    }, [balances]); // Only re-compute when balances change, not when prices change

    // The original code created formattedBalances but never used it - now we actually use it!
    // Also fixed the toFixed() call to include 2 decimal places for proper currency formatting
    const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
        return sortedBalances.map((balance) => ({
            ...balance,
            formatted: balance.amount.toFixed(2) // Show 2 decimal places for currency amounts
        }));
    }, [sortedBalances]);

    // Using formattedBalances here instead of sortedBalances (which doesn't have the 'formatted' property)
    // Added a safety check for missing prices to prevent NaN errors
    // Using a unique key instead of array index (which is a React anti-pattern)
    const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
        // Protect against missing prices - if a price doesn't exist, default to 0
        const price = prices[balance.currency] || 0;
        const usdValue = price * balance.amount;

        return (
            <WalletRow
                className={classes.row}
                key={`${balance.blockchain}-${balance.currency}`} // Unique key based on blockchain and currency
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted} // This property is now available from formattedBalances
            />
        );
    });

    // Note: For production code, you'd want to add error handling here
    // Either at the hook level (useWalletBalances, usePrices) or with React error boundaries
    return (
        <div {...rest}>
            {rows}
        </div>
    );
};
