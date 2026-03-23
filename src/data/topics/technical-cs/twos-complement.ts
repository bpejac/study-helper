import { Topic } from '@/types';

export const twosComplement: Topic = {
  id: 'twos-complement',
  title: "Two's Complement & One's Complement",
  description: 'Binary number representations for signed integers in computer systems',
  category: 'technical-cs',
  confidence: 'advanced',
  keyPoints: [
    {
      title: "One's Complement",
      description: "**One's complement** represents negative numbers by **flipping all bits** (bitwise NOT):\n\n- **+5** = `0000 0101` → **-5** = `1111 1010`\n- The MSB (most significant bit) indicates sign: `0` = positive, `1` = negative\n- **Range** for n bits: $-(2^{n-1} - 1)$ to $+(2^{n-1} - 1)$. For 8 bits: **-127 to +127**\n- **Problem: two representations of zero**: `+0 = 0000 0000` and `-0 = 1111 1111`. This complicates hardware (must check both) and wastes one bit pattern.\n- **End-around carry**: when adding, any carry out of the MSB must be added back to the LSB — extra hardware step.\n- Historically used in some early machines (CDC 6600), but **superseded by two's complement** in virtually all modern systems.",
    },
    {
      title: "Two's Complement",
      description: "**Two's complement** is the standard signed integer representation in all modern computers:\n\n- To negate: **flip all bits** (one's complement) **then add 1**\n- **+5** = `0000 0101` → flip → `1111 1010` → +1 → `1111 1011` = **-5**\n- MSB still indicates sign: `0` = positive, `1` = negative\n- **Single representation of zero**: `0000 0000` only (flipping + adding 1 wraps back to 0)\n\nWhy it works: for n bits, the **negation of x is $2^n - x$**. This means addition and subtraction use the **same hardware circuit** — the CPU doesn't need separate adder/subtractor. Negative numbers are naturally handled by the overflow behavior of unsigned addition.\n\nQuick negation trick: scan from right, keep everything through the first `1`, then flip the rest. Example: `0110 0100` → keep `100`, flip `01100` → `1001 1100`.",
    },
    {
      title: 'Range & Representation',
      description: "For an **n-bit** two's complement number:\n\n- **Range**: $-2^{n-1}$ to $+2^{n-1} - 1$\n- **8-bit**: -128 to +127 (256 values)\n- **16-bit**: -32,768 to +32,767\n- **32-bit**: -2,147,483,648 to +2,147,483,647 (~±2.1 billion)\n- **64-bit**: -9,223,372,036,854,775,808 to +9,223,372,036,854,775,807\n\nThe **asymmetry** (one more negative than positive) is because zero uses one of the positive patterns, and the most negative number (`1000...0`) has no positive counterpart. Negating the minimum value **overflows**: `-(-128) = +128` which doesn't fit in 8 bits!\n\n**Weight interpretation**: the MSB has weight $-2^{n-1}$ instead of $+2^{n-1}$. For `1011 0100` (8-bit): $-128 + 32 + 16 + 4 = -76$.",
    },
    {
      title: 'Sign Extension',
      description: "**Sign extension** preserves the value when converting to a larger bit width:\n\n- **Copy the MSB** (sign bit) into all new higher bits\n- Positive: pad with `0`s. `0101 1010` (8-bit +90) → `0000 0000 0101 1010` (16-bit +90)\n- Negative: pad with `1`s. `1010 0110` (8-bit -90) → `1111 1111 1010 0110` (16-bit -90)\n\nWhy it works: in two's complement, the MSB represents $-2^{n-1}$. Extending with the same bit value maintains the same numerical value because $-2^{n-1} = -2^n + 2^{n-1}$ (the new MSB `1` contributes $-2^n$ and the old MSB `1` contributes $+2^{n-1}$).\n\n**Zero extension** (for unsigned): always pad with `0`s, regardless of MSB.\n\n**Truncation** (narrowing): discard higher bits. Safe only if discarded bits are all sign extensions of the remaining MSB. Otherwise, **overflow** silently corrupts the value.",
    },
    {
      title: 'Overflow Detection',
      description: "**Signed overflow** occurs when the result doesn't fit in the bit width. Detection rules:\n\n- **Positive + Positive = Negative**: overflow (result wrapped around)\n- **Negative + Negative = Positive**: overflow\n- **Positive + Negative**: **can never overflow** (result is between the two operands)\n\nHardware detection: overflow occurs when the **carry into the MSB ≠ carry out of the MSB**.\n\n**Unsigned overflow** (carry): simply check the carry-out bit.\n\nIn programming languages:\n- **C/C++**: signed integer overflow is **undefined behavior** (compiler can assume it doesn't happen!). Unsigned overflow is well-defined (wraps modulo $2^n$).\n- **Java**: signed overflow silently wraps. No unsigned integers.\n- **Rust**: debug mode panics on overflow; release mode wraps. Explicit methods: `wrapping_add()`, `checked_add()`, `saturating_add()`.\n- **JavaScript**: all numbers are doubles — integer overflow becomes precision loss (see floating point).",
    },
    {
      title: 'Bitwise Operations & Tricks',
      description: "Common **bitwise operations** on two's complement integers:\n\n- **AND** (`&`): mask bits. `x & 0xFF` extracts lowest byte. `x & 1` tests if odd.\n- **OR** (`|`): set bits. `x | mask` turns on specific bits.\n- **XOR** (`^`): toggle bits. `x ^ x = 0`, `x ^ 0 = x`. **Swap without temp**: `a ^= b; b ^= a; a ^= b;`\n- **NOT** (`~`): flip all bits. In two's complement: `~x = -(x+1)`. So `~0 = -1`, `~5 = -6`.\n- **Left shift** (`<<`): multiply by $2^n$. `x << 3` = `x × 8`. May overflow.\n- **Arithmetic right shift** (`>>`): divide by $2^n$, preserving sign (fills with MSB). `-8 >> 1 = -4`.\n- **Logical right shift** (`>>>`): fills with zeros (treats as unsigned). JS only.\n\n**Useful tricks**:\n- Check power of 2: `x > 0 && (x & (x-1)) === 0`\n- Lowest set bit: `x & (-x)` isolates the rightmost `1` bit\n- Clear lowest set bit: `x & (x-1)`\n- Count set bits: **popcount** / Hamming weight",
    },
  ],
  quizQuestions: [
    {
      question: "How do you convert a positive number to its negative in two's complement?",
      answer: "Flip all bits (one's complement) and add 1. For example, +5 (0000 0101) → flip → (1111 1010) → add 1 → (1111 1011) = -5. Shortcut: scan from right, keep everything through the first 1, then flip the remaining higher bits.",
    },
    {
      question: "Why is two's complement preferred over one's complement?",
      answer: "Two's complement has a single representation of zero (no +0 and -0), uses the full range (one extra negative value), and addition/subtraction work with the same hardware circuit — no special handling for negative numbers or end-around carry.",
    },
    {
      question: "What is the range of an 8-bit signed integer in two's complement?",
      answer: "-128 to +127. The formula is -2^(n-1) to 2^(n-1)-1. For 8 bits: -2^7 to 2^7-1 = -128 to 127. The range is asymmetric because zero uses one of the 256 positive patterns. Total: 256 distinct values.",
    },
    {
      question: "How do you detect overflow in two's complement addition?",
      answer: "Overflow occurs when: 1) Adding two positives gives a negative result, 2) Adding two negatives gives a positive result. Adding a positive and negative can NEVER overflow. In hardware: overflow when carry INTO the MSB ≠ carry OUT of the MSB.",
    },
    {
      question: "What is sign extension and when is it used?",
      answer: "Sign extension copies the MSB (sign bit) into all new higher-order bits when converting to a larger bit width. Example: 8-bit -90 (10100110) becomes 16-bit -90 (1111111110100110). It preserves the two's complement value. Used when widening registers, loading bytes into words, etc.",
    },
    {
      question: "Why is signed integer overflow undefined behavior in C?",
      answer: "The C standard declares signed overflow undefined to allow compiler optimizations. If overflow 'can't happen,' the compiler can assume loops will terminate, simplify comparisons, and use optimal machine instructions. This enables better code but makes bugs harder to find — two positive numbers can 'sum' to negative without any error.",
    },
    {
      question: "What is the weight of the MSB in two's complement?",
      answer: "The MSB has weight -2^(n-1) instead of +2^(n-1). For an 8-bit number, the MSB represents -128. To find the value of any two's complement number, sum the bit weights: MSB contributes -128, then remaining bits contribute +64, +32, +16, +8, +4, +2, +1 as usual.",
    },
    {
      question: "Why can't you negate the minimum two's complement value?",
      answer: "The minimum value (e.g., -128 for 8-bit) has no positive counterpart because the range is -128 to +127. Negating -128 should give +128, which doesn't fit. The result wraps around to -128 again. This is the only value where negation overflows, and it's a common source of bugs.",
    },
    {
      question: "How does arithmetic right shift differ from logical right shift?",
      answer: "Arithmetic right shift (>>) preserves the sign by filling new MSBs with the sign bit — effectively dividing by 2^n for signed numbers. Logical right shift (>>> in JS) fills with zeros — treating the number as unsigned. For positive numbers they're identical; for negative numbers, arithmetic shift stays negative while logical shift becomes positive.",
    },
    {
      question: "How can you check if a number is a power of 2 using bitwise operations?",
      answer: "Use: x > 0 && (x & (x-1)) === 0. Powers of 2 have exactly one bit set (e.g., 8 = 1000). x-1 flips that bit and sets all lower bits (7 = 0111). ANDing gives 0 only for powers of 2. The x > 0 check excludes 0 (which would otherwise pass).",
    },
    {
      question: "What is the relationship between bitwise NOT and two's complement?",
      answer: "In two's complement, ~x = -(x+1). Flipping all bits gives the one's complement (which is one less than the two's complement negation). So ~0 = -1, ~5 = -6, ~(-1) = 0. This means -x = ~x + 1, which is exactly the negation formula.",
    },
    {
      question: "What is the difference between unsigned and signed overflow behavior?",
      answer: "Unsigned overflow is well-defined in most languages: it wraps modulo 2^n (e.g., 255 + 1 = 0 for 8-bit unsigned). Signed overflow is undefined in C/C++ (compiler can assume it doesn't happen), silently wraps in Java, and panics in Rust debug mode. The hardware behavior is the same — the difference is in language semantics.",
    },
  ],
  codeExamples: [
    {
      title: "Two's Complement Conversion & Verification",
      language: 'text',
      code: `════ Converting -5 to 8-bit two's complement ════

Step 1: Write +5 in binary
   +5 = 0000 0101

Step 2: Flip all bits (one's complement)
        1111 1010

Step 3: Add 1 (two's complement)
        1111 1010
      +         1
        ─────────
        1111 1011  ← This is -5 in two's complement

Verification using weight method:
  1111 1011
  = -128 + 64 + 32 + 16 + 8 + 0 + 2 + 1
  = -128 + 123
  = -5 ✓

════ Quick negation trick ════
+76 = 0100 1100
       Scan from right, keep through first 1: ....100
       Flip the rest: 1011 0100 = -76 ✓

════ One's complement comparison ════
Method:           One's complement    Two's complement
-5 from +5:      flip bits only       flip + add 1
+5 =             0000 0101            0000 0101
-5 =             1111 1010            1111 1011
Zeros:           +0 = 0000 0000      0 = 0000 0000
                 -0 = 1111 1111      (no -0!)
Range (8-bit):   -127 to +127        -128 to +127`,
      explanation: "Two's complement eliminates the dual-zero problem, gives one extra negative value, and allows addition/subtraction with the same circuit. The weight method (MSB = -128) provides a quick way to verify: sum all bit positions with the MSB negative.",
    },
    {
      title: 'Arithmetic & Overflow Examples',
      language: 'text',
      code: `════ 8-bit Two's Complement Arithmetic ════

Example 1: 5 + (-3) = 2  (positive + negative: can't overflow)
   0000 0101  (+5)
 + 1111 1101  (-3)
   ─────────
 1 0000 0010  carry out discarded → 0000 0010 = +2 ✓

Example 2: -5 + (-3) = -8  (negative + negative: no overflow here)
   1111 1011  (-5)
 + 1111 1101  (-3)
   ─────────
 1 1111 1000  carry out discarded → 1111 1000 = -8 ✓

Example 3: 100 + 50 = 150  → OVERFLOW! (can't fit in signed 8-bit)
   0110 0100  (+100)
 + 0011 0010  (+50)
   ─────────
   1001 0110  = -106 ← Wrong! Two positives gave negative = OVERFLOW
   
   Carry into MSB = 1, Carry out of MSB = 0 → 1 ≠ 0 → overflow detected

Example 4: -100 + (-50) = -150  → OVERFLOW!
   1001 1100  (-100)
 + 1100 1110  (-50)
   ─────────
 1 0110 1010  = +106 ← Wrong! Two negatives gave positive = OVERFLOW

════ Sign Extension ════
+90 (8-bit):  0101 1010 → 16-bit: 0000 0000 0101 1010  (pad with 0s)
-90 (8-bit):  1010 0110 → 16-bit: 1111 1111 1010 0110  (pad with 1s)

Verify -90:  1111 1111 1010 0110
= -32768 + 16384 + ... + 32 + 4 + 2 = -90 ✓`,
      explanation: "Two's complement addition uses the same circuit regardless of sign. Overflow only happens with same-sign additions: pos+pos=neg or neg+neg=pos. The carry discarding naturally handles mixed-sign addition. Sign extension preserves value by replicating the sign bit.",
    },
    {
      title: 'Bitwise Operations & Tricks in Code',
      language: 'javascript',
      code: `// ═══ Two's complement in JavaScript (32-bit integers with bitwise ops) ═══

// Bitwise NOT: ~x = -(x+1)
console.log(~0);     // -1  (flip all bits of 00...00 → 11...11 = -1)
console.log(~5);     // -6  (-(5+1))
console.log(~-1);    // 0   (-(-1+1))

// Negation: -x = ~x + 1
const x = 42;
console.log(~x + 1);         // -42
console.log((-x) === ~x + 1); // true

// ═══ Useful bitwise tricks ═══

// Check if number is power of 2
function isPowerOf2(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
console.log(isPowerOf2(64));   // true  (1000000 & 0111111 = 0)
console.log(isPowerOf2(65));   // false (1000001 & 1000000 ≠ 0)

// Isolate lowest set bit
function lowestBit(n) { return n & (-n); }
console.log(lowestBit(12));    // 4  (1100 & 0100 = 0100)
console.log(lowestBit(10));    // 2  (1010 & 0110 = 0010)

// Clear lowest set bit
function clearLowestBit(n) { return n & (n - 1); }
console.log(clearLowestBit(12)); // 8  (1100 & 1011 = 1000)

// Count set bits (popcount / Hamming weight)
function popcount(n) {
  let count = 0;
  while (n) {
    n &= n - 1;  // Clear lowest set bit each iteration
    count++;
  }
  return count;
}
console.log(popcount(0b11010110));  // 5

// Swap without temp variable (XOR swap)
let a = 5, b = 3;
a ^= b;  // a = 5^3 = 6
b ^= a;  // b = 3^6 = 5
a ^= b;  // a = 6^5 = 3
console.log(a, b);  // 3, 5

// Arithmetic vs Logical right shift
console.log(-8 >> 1);   // -4  (arithmetic: sign-preserving)
console.log(-8 >>> 1);  // 2147483644  (logical: fills with 0)
// -8 = 11111111111111111111111111111000
// >>1: 11111111111111111111111111111100 = -4
// >>>1: 01111111111111111111111111111100 = 2147483644`,
      explanation: "JavaScript's bitwise operators convert numbers to 32-bit signed integers (two's complement). ~x = -(x+1) is the bitwise NOT identity. XOR swap is a classic interview trick. The >>> operator (logical right shift) is unique to JS and treats the number as unsigned.",
    },
  ],

};
