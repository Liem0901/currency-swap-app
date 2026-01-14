// Three unique implementations of sum_to_n function

// Implementation A: Iterative approach using a loop
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Implementation B: Recursive approach
var sum_to_n_b = function(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return n + sum_to_n_b(n - 1);
};

// Implementation C: Mathematical formula (Gauss's formula)
var sum_to_n_c = function(n) {
    return (n * (n + 1)) / 2;
};

// Test cases
console.log('sum_to_n_a(5):', sum_to_n_a(5)); // Expected: 15
console.log('sum_to_n_b(5):', sum_to_n_b(5)); // Expected: 15
console.log('sum_to_n_c(5):', sum_to_n_c(5)); // Expected: 15

console.log('sum_to_n_a(10):', sum_to_n_a(10)); // Expected: 55
console.log('sum_to_n_b(10):', sum_to_n_b(10)); // Expected: 55
console.log('sum_to_n_c(10):', sum_to_n_c(10)); // Expected: 55
