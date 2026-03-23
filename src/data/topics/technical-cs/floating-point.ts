import { Topic } from '@/types';

export const floatingPoint: Topic = {
  id: 'floating-point',
  title: 'Floating Point Representation',
  description: 'IEEE 754 standard for representing real numbers in binary',
  category: 'technical-cs',
  confidence: 'advanced',
  keyPoints: [
    {
      title: 'IEEE 754 Format',
      description: 'IEEE 754 defines how real numbers are stored in binary using three components:\n\n- **Sign bit** (1 bit): `0` = positive, `1` = negative\n- **Exponent** (8 bits single / 11 bits double): biased encoding (actual exponent + bias)\n- **Mantissa / Significand** (23 bits single / 52 bits double): the fractional part\n\n**Total sizes**: Single precision = **32 bits** (float), Double precision = **64 bits** (double). JavaScript uses **double precision** for all numbers.\n\nThe formula: $(-1)^s \\times 1.\\text{mantissa} \\times 2^{\\text{exponent} - \\text{bias}}$\n\nThe key insight is that the **binary point floats** (moves) based on the exponent — hence "floating point." This allows representing both very large ($10^{308}$) and very small ($10^{-308}$) numbers with the same fixed number of bits.',
    },
    {
      title: 'Normalized & Denormalized Numbers',
      description: '**Normalized numbers** (most common) have an **implicit leading 1** before the mantissa:\n\n- Value = $1.\\text{mantissa} \\times 2^{\\text{exponent} - \\text{bias}}$\n- The leading 1 is **not stored** — gives one extra bit of precision for free\n- Exponent range: `1` to `254` (single) or `1` to `2046` (double) — `0` and `255/2047` are reserved for special values\n\n**Denormalized / subnormal numbers** (exponent = all zeros):\n- Value = $0.\\text{mantissa} \\times 2^{1 - \\text{bias}}$ (implicit leading **0**, not 1)\n- Fill the gap between zero and the smallest normalized number\n- Enable **gradual underflow** — numbers get less precise as they approach zero, rather than jumping straight to zero\n- The smallest **positive** denormalized double is $\\approx 5 \\times 10^{-324}$',
    },
    {
      title: 'Exponent Bias',
      description: '**Bias** is a constant added to the actual exponent to store it as an **unsigned** value:\n\n- **Single precision** bias = **127**. Stored exponent `129` → actual exponent = `129 - 127 = 2`\n- **Double precision** bias = **1023**. Stored exponent `1025` → actual = `1025 - 1023 = 2`\n\nWhy bias instead of two\'s complement?\n- Allows **direct comparison** of floating-point magnitudes as if they were integers (sign, then exponent, then mantissa — all compare naturally)\n- Simplifies hardware sorting and comparison circuits\n- Exponent range: single = `−126` to `+127`, double = `−1022` to `+1023`\n\nReserved exponent values:\n- **All zeros** (0): denormalized numbers and ±0\n- **All ones** (255/2047): ±Infinity and NaN',
    },
    {
      title: 'Special Values',
      description: 'IEEE 754 defines several **special values** using reserved bit patterns:\n\n- **Positive zero** (+0): sign=0, exponent=0, mantissa=0\n- **Negative zero** (-0): sign=1, exponent=0, mantissa=0. `+0 === -0` is `true` in JS, but `1/+0 = +Infinity`, `1/-0 = -Infinity`. Use `Object.is(+0, -0)` → `false`.\n- **Positive Infinity** (+∞): exponent=all 1s, mantissa=0. Result of `1/0` or overflow.\n- **Negative Infinity** (-∞): sign=1, exponent=all 1s, mantissa=0.\n- **NaN** (Not a Number): exponent=all 1s, mantissa≠0. Result of `0/0`, `Math.sqrt(-1)`, `parseInt("hello")`.\n  - **NaN ≠ NaN** (by specification). Use `Number.isNaN()` to check.\n  - There are **quiet NaN** (propagates through calculations) and **signaling NaN** (triggers exception when used).\n- **Infinity arithmetic**: `∞ + ∞ = ∞`, `∞ - ∞ = NaN`, `∞ × 0 = NaN`, `∞ / ∞ = NaN`',
    },
    {
      title: 'Precision Limitations',
      description: 'Many decimal numbers **cannot be exactly represented** in binary floating point:\n\n- **0.1** in binary is the repeating fraction `0.0001100110011...` (like 1/3 = 0.333... in decimal). It must be **rounded** to fit in 52 mantissa bits.\n- **0.1 + 0.2 ≠ 0.3**: the accumulated rounding errors produce `0.30000000000000004`.\n- **Precision**: doubles have ~**15-17 significant decimal digits**. Singles have ~7.\n- **Integers**: doubles can exactly represent integers up to $2^{53}$ (9,007,199,254,740,992). Beyond that, gaps appear: `2^53 + 1 === 2^53` is `true`!\n- **Catastrophic cancellation**: subtracting nearly equal numbers loses most significant digits, amplifying relative error.\n- **Associativity lost**: `(a + b) + c ≠ a + (b + c)` in floating point — order of operations matters.\n\n**JavaScript\'s `Number.EPSILON`** ($\\approx 2.22 \\times 10^{-16}$): the smallest number where `1 + ε ≠ 1`.',
    },
    {
      title: 'Practical Solutions',
      description: 'Dealing with floating-point limitations in real code:\n\n- **Epsilon comparison**: never compare floats with `===`. Use `Math.abs(a - b) < epsilon` (but choosing the right epsilon is tricky — relative comparison is better: `Math.abs(a - b) <= Math.max(Math.abs(a), Math.abs(b)) * epsilon`)\n- **Integer arithmetic for money**: store cents as integers (`$1.99 → 199`). Or use libraries like `decimal.js`, `big.js`, `dinero.js`.\n- **`BigInt`** (JS): arbitrary-precision integers. `9007199254740993n` works correctly. Cannot mix with regular numbers without explicit conversion.\n- **Rounding**: `Math.round(x * 100) / 100` for 2 decimal places. Or `Number.toFixed(2)` (returns a string!).\n- **Decimal types** in other languages: `Decimal` (Python), `BigDecimal` (Java), `DECIMAL(10,2)` (SQL) — store exact decimal representations.\n- **Kahan summation**: algorithm to minimizes error when summing many floating-point numbers by tracking a compensation term.',
    },
  ],
  quizQuestions: [
    {
      question: 'What are the three components of an IEEE 754 floating point number?',
      answer: 'Sign bit (1 bit: 0=positive, 1=negative), Exponent (8 bits single / 11 bits double, biased encoding), and Mantissa/Significand (23 bits single / 52 bits double, the fractional part). The implicit leading 1 gives one extra bit of precision.',
    },
    {
      question: 'Why is 0.1 + 0.2 !== 0.3 in JavaScript?',
      answer: '0.1 cannot be exactly represented in binary — it\'s a repeating fraction (0.0001100110011...), like 1/3 in decimal. Both 0.1 and 0.2 are rounded to the nearest representable double. The accumulated rounding errors produce 0.30000000000000004, which is not exactly 0.3.',
    },
    {
      question: 'What is the bias in IEEE 754 and why is it used?',
      answer: 'Bias is 127 (single) or 1023 (double). It\'s added to the actual exponent so it can be stored as an unsigned number. This allows floating-point magnitudes to be compared directly as integers (sign → exponent → mantissa), simplifying hardware comparison circuits.',
    },
    {
      question: 'Why does NaN === NaN return false?',
      answer: 'By IEEE 754 specification, NaN is "not equal to anything, including itself." This was designed so that any comparison involving NaN returns false, since NaN represents an undefined/indeterminate result. Use Number.isNaN(x) for reliable detection (not the global isNaN which coerces). Or use Object.is(x, NaN).',
    },
    {
      question: 'What is the implicit leading 1 in normalized floating point numbers?',
      answer: 'In normalized form, the mantissa is always 1.xxxxx (the integer part is always 1 for any non-zero binary normalized number). Since this 1 is always present, it doesn\'t need to be stored — saving one bit and giving a "free" extra bit of precision. Denormalized numbers use an implicit 0 instead.',
    },
    {
      question: 'What is the difference between +0 and -0 in IEEE 754?',
      answer: 'They have different sign bits (0 vs 1) but are considered equal by == and ===. However, they behave differently in division: 1/+0 = +Infinity, 1/-0 = -Infinity. Use Object.is(+0, -0) to distinguish them (returns false). -0 exists because the sign bit is independent of the value.',
    },
    {
      question: 'What is the largest integer that can be exactly represented in a double?',
      answer: '2^53 = 9,007,199,254,740,992 (Number.MAX_SAFE_INTEGER is 2^53 - 1). Beyond 2^53, there are gaps between representable integers — not every integer can be represented. For example, 2^53 + 1 cannot be distinguished from 2^53. Use BigInt for larger integers.',
    },
    {
      question: 'What are denormalized (subnormal) numbers and why do they exist?',
      answer: 'Denormalized numbers have exponent = 0 and an implicit leading 0 (not 1). They fill the gap between zero and the smallest normalized number, enabling "gradual underflow" — values smoothly decrease to zero with decreasing precision, instead of abruptly dropping to zero (which would cause computational issues).',
    },
    {
      question: 'Why should you never use floating point for money?',
      answer: 'Floating point can\'t exactly represent many decimal fractions (0.1, 0.01). Rounding errors accumulate in financial calculations: $0.10 + $0.20 might not equal $0.30. Use integer cents (199 for $1.99), dedicated decimal libraries (decimal.js, dinero.js), or SQL DECIMAL type that stores exact decimal representations.',
    },
    {
      question: 'What is catastrophic cancellation?',
      answer: 'When subtracting two nearly equal floating-point numbers, the leading significant digits cancel out, leaving only the less-precise trailing digits. This amplifies relative error dramatically. Example: if a = 1.00000001 and b = 1.00000000, a-b loses most significant digits. Restructure formulas to avoid this.',
    },
    {
      question: 'Why is floating-point addition not associative?',
      answer: 'Due to rounding at each step, (a + b) + c may not equal a + (b + c). Example: with large a, small b and c, a + b might round away b entirely, but b + c first might produce a value large enough to affect a. This has real consequences for parallel computation and compiler optimizations.',
    },
    {
      question: 'What is Number.EPSILON in JavaScript?',
      answer: 'Number.EPSILON is approximately 2.22 × 10^-16 — the smallest value such that 1 + EPSILON !== 1. It represents the machine epsilon for double precision: the gap between 1.0 and the next representable number. It\'s often used as the tolerance in floating-point comparisons, but should be scaled relative to the magnitude of the numbers being compared.',
    },
  ],
  codeExamples: [
    {
      title: 'IEEE 754 Single Precision Breakdown',
      language: 'text',
      code: `32-bit Single Precision (float):
┌───┬──────────┬───────────────────────────┐
│ S │ Exponent │       Mantissa            │
│ 1 │  8 bits  │       23 bits             │
└───┴──────────┴───────────────────────────┘

════ Example: Represent -6.625 ════

Step 1: Convert to binary
  6 = 110, 0.625 = 0.101  → 6.625 = 110.101

Step 2: Normalize (move binary point to after first 1)
  110.101 = 1.10101 × 2²

Step 3: Encode components
  Sign     = 1 (negative)
  Exponent = 2 + 127 (bias) = 129 = 10000001
  Mantissa = 10101000000000000000000 (drop implicit leading 1)

Result: 1  10000001  10101000000000000000000
Sign─┘  └Exponent┘  └─────Mantissa────────┘

Hexadecimal: 0xC0D40000

════ 64-bit Double Precision ════
┌───┬─────────────┬────────────────────────────────────────────────────┐
│ S │  Exponent   │                    Mantissa                       │
│ 1 │  11 bits    │                    52 bits                        │
└───┴─────────────┴────────────────────────────────────────────────────┘
Bias = 1023, ~15-17 significant decimal digits

════ Special Bit Patterns ════
+0:       0 00000000 00000000000000000000000
-0:       1 00000000 00000000000000000000000
+Infinity: 0 11111111 00000000000000000000000
-Infinity: 1 11111111 00000000000000000000000
NaN:       0 11111111 10000000000000000000000  (any non-zero mantissa)
Smallest+: 0 00000001 00000000000000000000000  = 2^-126 ≈ 1.18×10⁻³⁸
Smallest denorm: 0 00000000 00000000000000000000001 = 2^-149 ≈ 1.4×10⁻⁴⁵`,
      explanation: 'The leading 1 is implicit in normalized numbers (mantissa always starts with 1.xxxxx). The exponent is biased to allow unsigned comparison. Special patterns with all-ones exponent encode Infinity and NaN. Denormalized numbers (exponent=0) fill the gap near zero.',
    },
    {
      title: 'Floating Point Pitfalls & Solutions',
      language: 'javascript',
      code: `// ═══ Classic precision issues ═══
console.log(0.1 + 0.2);           // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);   // false!
console.log(1.005 * 100);         // 100.49999999999999 (not 100.5!)
console.log(9007199254740992 + 1); // 9007199254740992 (lost!)

// ═══ Special values ═══
console.log(1 / 0);               // Infinity
console.log(-1 / 0);              // -Infinity
console.log(0 / 0);               // NaN
console.log(NaN === NaN);         // false
console.log(Number.isNaN(NaN));   // true (use this, not global isNaN!)
console.log(Object.is(+0, -0));   // false (they're different!)
console.log(+0 === -0);           // true  (but === says same)

// ═══ Safe integer limits ═══
console.log(Number.MAX_SAFE_INTEGER);  // 9007199254740991 (2^53 - 1)
console.log(2 ** 53 === 2 ** 53 + 1);  // true! Precision lost

// ═══ SOLUTIONS ═══

// 1. Epsilon comparison (basic)
function nearlyEqual(a, b, epsilon = Number.EPSILON) {
  return Math.abs(a - b) < epsilon;
}
console.log(nearlyEqual(0.1 + 0.2, 0.3)); // true

// 2. Relative comparison (better for large numbers)
function relativelyEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= Math.max(Math.abs(a), Math.abs(b)) * tolerance;
}

// 3. Integer arithmetic for money
const priceInCents = 199;  // $1.99 stored as integer
const tax = Math.round(priceInCents * 0.08);  // 16 cents
const total = priceInCents + tax;  // 215 cents = $2.15
console.log((total / 100).toFixed(2));  // "2.15"

// 4. BigInt for large integers
const big = 9007199254740993n;     // Works correctly with BigInt
console.log(big + 1n);             // 9007199254740994n
// Cannot mix: big + 1 → TypeError

// 5. toFixed for display (returns string!)
console.log((0.1 + 0.2).toFixed(2));  // "0.30"`,
      explanation: '0.1 is a repeating binary fraction that gets rounded to 52 bits. Classic comparison with === fails. Solutions: epsilon comparison for near-zero values, relative comparison for general use, integer cents for money, BigInt for large integers, toFixed for display only.',
    },
    {
      title: 'Decimal-to-Binary Float Conversion',
      language: 'text',
      code: `════ Why 0.1 can't be exact in binary ════

Convert 0.1 (decimal) to binary:
  0.1 × 2 = 0.2  → 0
  0.2 × 2 = 0.4  → 0
  0.4 × 2 = 0.8  → 0
  0.8 × 2 = 1.6  → 1
  0.6 × 2 = 1.2  → 1
  0.2 × 2 = 0.4  → 0   ← repeats!
  0.4 × 2 = 0.8  → 0
  0.8 × 2 = 1.6  → 1
  ...

  0.1₁₀ = 0.0001100110011001100110011... (repeating)

  Like 1/3 = 0.333... in decimal — it's EXACT in base 3 (0.1₃)
  but infinite in base 10. Same problem with 0.1 in base 2.

  Stored as: 1.1001100110011001100110011001100110011001100110011010 × 2⁻⁴
  (52-bit mantissa, rounded — the last bit causes the error)

════ Numbers that ARE exact in binary float ════

  0.5   = 0.1₂           ✓ (1/2)
  0.25  = 0.01₂          ✓ (1/4)
  0.125 = 0.001₂         ✓ (1/8)
  0.375 = 0.011₂         ✓ (3/8)
  0.75  = 0.11₂          ✓ (3/4)

  Rule: a decimal is exact in binary float if it equals
  a fraction whose denominator is a power of 2 (k/2ⁿ).

  0.1 = 1/10 — denominator has factor 5 → NOT exact in binary
  0.2 = 1/5  — same problem
  0.3 = 3/10 — same problem`,
      explanation: 'The fundamental issue: a number that terminates in decimal may repeat infinitely in binary (and vice versa). Only fractions with power-of-2 denominators (1/2, 1/4, 1/8, 3/4, etc.) are exact in binary floating point. This is why 0.1, 0.2, and 0.3 all have rounding errors.',
    },
  ],
};
