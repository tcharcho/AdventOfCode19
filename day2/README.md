# Day 2: 1202 Program Alarm

## Part Two

For the second part of the puzzle, you are given an output and asked to determine which set of inputs (**noun** and **verb**) yields the desired output. The **noun** and **verb** are both integers between 0 and 99 (inclusive).

The brute force method is to run all possible combinations and see which yields the output. However seeing as the intcode program is a set of mathematical operations, I wanted to see if it was possible to map the program to an equation, and use the equation when running the different combinations of (**noun**, **verb**).

To do this, I used a tree data struture, implemented as a dictionary:

```
Equation = {
  root: the symbol corresponding to the operation (+/*)
  left: the first value in the operation OR annother equation
  right: the second value in the operation OR annother equation
}
```

i.e.
```
    +
  /   \           ==>  1 + 2
1       2


       *
     /   \
    +     4       ==> (1+2) * 4
  /   \
1       2
```

### Method
1. Run intcode program once
2. Map intcode program to Equation tree (the operations requird to obtain value in position 0)
3. Traverse Equation tree and get string value of the equation
4. Iterate through all combinations of (**noun**, **verb**) and sub in the values in the equation string

### Problems
In order to accurately map the operations, I needed to take into account that **noun** and **verb** are both variables; i.e. the values in the 1st and 2nd position in the intcode program are dynamic and can change from run to run. This requires me to address 2 things when initially running the intcode program:

1. When the values in the 1st or 2nd position are required for an operation

    ```
    i.e.
      Instruction:          1,1,5,4
      Required operation:   pgm[4] = pgm[1] + pgm[5]
      Assuming:             pgm[5] = 3 and pgm[1] = 2
      Equation:             3 + 2
    ```

    I cannot simply use the value in the given program for address location 1. I will instead substitute it with the word "noun". So the equation in the above operation becomes: 3 + noun

2. When using the 1st and 2nd address in the intcode program (i.e. the first instruction)

    ```
    i.e.
      1st Instruction:          1,6,10,4
      Required operation:       pgm[4] = pgm[6] + pgm[10]
      Assuming:                 pgm[6] = 12 and pgm[10] = 5
      Equation:                 12 + 5
      ```

    I cannot simply use 6 and 10 to index the program as these are dynamic values. Instead, i will use the **noun** and **verb** variables to index the program. So the equation in the above operation becomes: pgm[noun] + pgm[verb]

### Excution
Once the tree has been constructed, the equation string can look like this:

```
( 4+( ( 5+( ( ( 2+( 1+( 3*( 2*( 2+( 2*( ( 4*( ( ( ( 1+( ( ( 4*( 2+( 2+( 3+( ( ( 3*( 2+( 2*( 3+( 1+( noun*( pgm[verb]+pgm[noun] ) ) ) ) ) ) )+2 )*4 ) ) ) ) )+2 )*2 ) )*5 )+4 )+1 ) )+1 ) ) ) ) ) ) )*2 )+1 ) )+verb ) )
```

At this point I will set the values for `verb` and `noun`, as well as have a variable `pgm` for the intcode program.
Running the string equation with the `eval()` function in JavaScript, yields the output in position 0 at the end of the run, given the dynamic inputs for noun and verb.