# Code Analysis: Computational Inefficiencies and Anti-Patterns

## Critical Bugs

### 1. **Undefined Variable (Line 39)**
- **Issue**: `lhsPriority` is used but never defined. Should be `balancePriority`.
- **Impact**: Runtime error - ReferenceError
- **Fix**: Replace `lhsPriority` with `balancePriority`

### 2. **Inverted Filter Logic (Lines 39-44)**
- **Issue**: The filter condition is backwards:
  - Returns `true` when `balance.amount <= 0` (keeps zero/negative balances)
  - Returns `false` for valid priorities (filters out valid balances)
- **Impact**: Filters out valid balances and keeps invalid ones
- **Fix**: Invert the logic to keep balances with `amount > 0` and `priority > -99`

### 3. **Missing Return Value in Sort (Line 53)**
- **Issue**: Sort comparator doesn't return `0` when priorities are equal
- **Impact**: Unstable sorting, potential performance issues
- **Fix**: Add `return 0` when `leftPriority === rightPriority`

### 4. **Type Mismatch (Line 63)**
- **Issue**: `sortedBalances` is typed as `WalletBalance[]` but used as `FormattedWalletBalance[]`
- **Impact**: TypeScript error, `balance.formatted` is undefined
- **Fix**: Use `formattedBalances` instead of `sortedBalances` in the map

### 5. **Unused Variable (Line 56)**
- **Issue**: `formattedBalances` is created but never used
- **Impact**: Unnecessary computation, memory waste
- **Fix**: Use `formattedBalances` in line 63

## Computational Inefficiencies

### 6. **Unnecessary Dependency in useMemo (Line 54)**
- **Issue**: `prices` is in dependency array but never used in the computation
- **Impact**: Unnecessary re-computation when prices change
- **Fix**: Remove `prices` from dependency array

### 7. **Inefficient Sort Comparison (Lines 45-53)**
- **Issue**: Multiple if-else statements instead of simple subtraction
- **Impact**: More operations than necessary
- **Fix**: Use `return rightPriority - leftPriority` for descending order

### 8. **Missing Null Check (Line 64)**
- **Issue**: `prices[balance.currency]` could be undefined
- **Impact**: `NaN` or runtime error when price is missing
- **Fix**: Add null/undefined check or use optional chaining

### 9. **getPriority Called Multiple Times**
- **Issue**: `getPriority` is called twice per balance in filter, and twice per comparison in sort
- **Impact**: Redundant function calls
- **Fix**: Calculate priority once and store it, or use a Map for caching

### 10. **toFixed() Without Precision (Line 59)**
- **Issue**: `toFixed()` without argument defaults to 0 decimal places
- **Impact**: Loss of precision for currency amounts
- **Fix**: Use `toFixed(2)` or appropriate decimal places

## Anti-Patterns

### 11. **Using Index as Key (Line 68)**
- **Issue**: `key={index}` is an anti-pattern in React
- **Impact**: Poor reconciliation, potential rendering issues when list changes
- **Fix**: Use unique identifier like `balance.currency` or combination of currency + blockchain

### 12. **TypeScript `any` Type (Line 19)**
- **Issue**: `blockchain: any` defeats TypeScript's type safety
- **Impact**: No compile-time type checking
- **Fix**: Create a union type or enum for blockchain values

### 13. **Missing Interface Properties**
- **Issue**: `WalletBalance` interface doesn't include `blockchain` property used in code
- **Impact**: TypeScript error, missing type definition
- **Fix**: Add `blockchain: string` to `WalletBalance` interface

### 14. **Inefficient Filter + Sort Chain**
- **Issue**: Filter and sort are chained, but could be optimized
- **Impact**: Multiple passes over the array
- **Fix**: Consider combining operations or using a single reduce

### 15. **No Error Handling**
- **Issue**: No try-catch or error boundaries for API calls
- **Impact**: Unhandled errors could crash the component
- **Fix**: Add error handling for `useWalletBalances()` and `usePrices()`

## Summary

**Total Issues Found**: 15
- **Critical Bugs**: 5
- **Performance Issues**: 5
- **Anti-Patterns**: 5
